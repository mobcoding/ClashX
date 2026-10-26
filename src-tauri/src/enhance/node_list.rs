use serde_yaml_ng::{Mapping, Value};
use std::collections::HashSet;

pub fn use_node_list(mut config: Mapping) -> Mapping {
    let Some(proxies) = config.get("proxies").and_then(Value::as_sequence) else {
        return config;
    };
    if proxies.is_empty()
        || ["proxy-groups", "rules"].iter().any(|key| {
            config.get(*key).is_some_and(|value| {
                !matches!(value, Value::Null) && value.as_sequence().is_none_or(|seq| !seq.is_empty())
            })
        })
    {
        return config;
    }

    let mut names: HashSet<&str> = proxies
        .iter()
        .filter_map(|proxy| proxy.get("name").and_then(Value::as_str))
        .collect();
    if let Some(providers) = config.get("proxy-providers").and_then(Value::as_mapping) {
        names.extend(providers.keys().filter_map(Value::as_str));
    }
    let mut name = "Proxy".to_owned();
    let mut suffix = 1;
    while names.contains(name.as_str()) {
        name = format!("Proxy {suffix}");
        suffix += 1;
    }

    let mut group = Mapping::new();
    group.insert("name".into(), name.clone().into());
    group.insert("type".into(), "select".into());
    group.insert("include-all".into(), true.into());
    config.insert("proxy-groups".into(), Value::Sequence(vec![Value::Mapping(group)]));
    let mut rules: Vec<Value> = [
        "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
        "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
        "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
        "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
        "IP-CIDR6,::1/128,DIRECT,no-resolve",
        "IP-CIDR6,fc00::/7,DIRECT,no-resolve",
        "IP-CIDR6,fe80::/10,DIRECT,no-resolve",
    ]
    .into_iter()
    .map(Value::from)
    .collect();
    rules.push(format!("MATCH,{name}").into());
    config.insert("rules".into(), Value::Sequence(rules));
    config
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn node_only_subscription_gets_a_selector_and_routing() -> Result<(), serde_yaml_ng::Error> {
        let proxies = (0..67)
            .map(|index| format!("- {{name: node-{index}, type: ss}}\n"))
            .collect::<String>();
        let original: Mapping = serde_yaml_ng::from_str(&format!("proxies:\n{proxies}"))?;
        let result = use_node_list(original.clone());
        assert_eq!(result["proxies"], original["proxies"]);
        assert_eq!(result["proxy-groups"][0]["type"], "select");
        assert_eq!(result["proxy-groups"][0]["include-all"], true);
        assert_eq!(result["rules"][7], "MATCH,Proxy");
        assert_eq!(use_node_list(result.clone()), result);
        Ok(())
    }

    #[test]
    fn authored_groups_or_rules_are_preserved() -> Result<(), serde_yaml_ng::Error> {
        for extra in [
            "proxy-groups: [{name: Custom, type: select, proxies: [node]}]",
            "rules: [MATCH,DIRECT]",
            "proxies: []",
        ] {
            let mut original: Mapping = serde_yaml_ng::from_str("proxies: [{name: node, type: ss}]")?;
            original.extend(serde_yaml_ng::from_str::<Mapping>(extra)?);
            assert_eq!(use_node_list(original.clone()), original);
        }
        Ok(())
    }

    #[test]
    fn empty_sequences_and_name_collisions_are_supported() -> Result<(), serde_yaml_ng::Error> {
        let original: Mapping = serde_yaml_ng::from_str(
            "proxies: [{name: Proxy, type: ss}]\nproxy-groups: []\nrules: []\nproxy-providers: {Proxy 1: {}}\nhosts: {ai.yun.dev: 192.168.8.100}",
        )?;
        let result = use_node_list(original.clone());
        assert_eq!(result["proxy-groups"][0]["name"], "Proxy 2");
        assert_eq!(result["rules"][7], "MATCH,Proxy 2");
        assert_eq!(result["hosts"], original["hosts"]);
        Ok(())
    }
}
