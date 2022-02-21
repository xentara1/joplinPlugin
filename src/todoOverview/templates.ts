export const profile = "```yaml\n" +
    "name: {{name}}\n" +
    "team: {{team}}\n" +
    "region: {{region}}\n" +
    "managed: {{managed}}\n" +
    "```\n" +
    "# {{name}}\n" +
    "\n" +
    "team | region |from| relationship | family | birthday\n" +
    "------|-----|---|-----|------|------|\n" +
    "{{team}} | {{region}} | {{nationality}} | Unknown | Unknown | Unknown\n" +
    "# Projects\n" +
    "\n" +
    "<!-- jat\n" +
    "search: tag:project\n" +
    "filter: \"return x.people.includes('{{name}}')\"\n" +
    "adjustmentFns: \n" +
    "  created_time: \"return moment.unix(x/1000).format('MM/DD/YYYY') \"\n" +
    "template: \"|Title|Team|Time|Link|\\n|---|---|---|---|\\n{{tag}}#pages{{ctag}}|{{tag}}title{{ctag}}|{{tag}}people{{ctag}}|{{tag}}created_time{{ctag}}|[{{tag}}title{{ctag}}](:/{{tag}}id{{ctag}})|\\n{{tag}}/pages{{ctag}}\"\n" +
    "-->\n" +
    "<!--JATOUT-->\n" +
    "\n" +
    "# Key Updates\n" +
    "<!-- jat\n" +
    "search: tag:profile/{{name}}\n" +
    "filter: \"return x.todo.includes('#update') && x.todo.includes('[ ]') && x.type == 'personalNote'\"\n" +
    "type: Task\n" +
    "template: \"{{tag}}todo{{ctag}} [:link:](:/{{tag}}id{{ctag}})\"\n" +
    "-->\n" +
      "<!--JATOUT-->\n" +
    "\n" +
    "# ToDos\n" +
    "<!-- jat\n" +
    "search: tag:profile/{{name}}\n" +
    "filter: \"return x.todo.includes('#task') && x.todo.includes('[ ]') && x.type == 'personalNote'\"\n" +
    "type: Task\n" +
    "template: \"{{tag}}todo{{ctag}} [:link:](:/{{tag}}id{{ctag}})\"\n" +
    "-->\n" +
    "<!--JATOUT-->\n" +
    "\n" +
    "# Catchups\n" +
    "<!-- jat\n" +
    "search: tag:profile/{{name}}\n" +
    "filter: \"return x.type == 'personalNote'\"\n" +
    "adjustmentFns: \n" +
    "  created_time: \"return moment.unix(x/1000).format('MM/DD/YYYY') \"\n" +
    "template: \"|Title|People|Time|Link|\\n|---|---|---|---|\\n{{tag}}#pages{{ctag}}|{{tag}}title{{ctag}}|{{tag}}people{{ctag}}|{{tag}}created_time{{ctag}}|[{{tag}}title{{ctag}}](:/{{tag}}id{{ctag}})|\\n{{tag}}/pages{{ctag}}\"\n" +
    "-->\n" +
    "<!--JATOUT-->"

export const project = "```yaml\n" +
    "name: {{name}}\n" +
    "lead: {{lead.label}}\n" +
    "people: {{#team}}{{label}},{{/team}}\n" +
    "managed: {{managed}}\n" +
    "Archived: NO\n" +
    "```\n" +
    "# {{name}}\n" +
    "\n" +
    "team | lead | \n" +
    "------|-----|\n" +
    "{{#team}}[{{label}}](:/{{value}}), {{/team}} | [{{lead.label}}](:/{{lead.value}}) |\n" +
    "\n" +
    "\n" +
    "# Key Updates\n" +
    "<!-- jat\n" +
    "search: tag:project/{{name}}\n" +
    "filter: \"return x.todo.includes('#update')&& x.todo.includes('[ ]')\"\n" +
    "type: Task\n" +
    "template: \"{{tag}}todo{{ctag}} [:link:](:/{{tag}}id{{ctag}})\"\n" +
    "-->\n" +
    "<!--JATOUT-->\n" +
    "# ToDos\n" +
    "<!-- jat\n" +
    "search: tag:project/{{name}}\n" +
    "filter: \"return x.todo.includes('#task') && x.todo.includes('[ ]')\"\n" +
    "type: Task\n" +
    "template: \"{{tag}}todo{{ctag}} [:link:](:/{{tag}}id{{ctag}})\"\n" +
    "-->\n" +
    "<!--JATOUT-->\n" +
    "\n" +
    "# Catchups\n" +
    "<!-- jat\n" +
    "search: tag:project/{{name}}\n" +
    "filter: \"return x.type == 'projectNote'\"\n" +
    "adjustmentFns: \n" +
    "  created_time: \"return moment.unix(x/1000).format('MM/DD/YYYY') \"\n" +
    "template: \"|Title|Team|Time|Link|\\n|---|---|---|---|\\n{{tag}}#pages{{ctag}}|{{tag}}title{{ctag}}|{{tag}}people{{ctag}}|{{tag}}created_time{{ctag}}|[{{tag}}title{{ctag}}](:/{{tag}}id{{ctag}})|\\n{{tag}}/pages{{ctag}}\"\n" +
    "-->\n" +
    "<!--JATOUT-->\n"

export const meeting = "```yaml\n" +
    "type: {{type}}\n" +
    "people: {{#team}}{{label}},{{/team}}\n" +
    "project: {{project.label}}\n" +
    "```\n" +
    "# {{name}}\n" +
    "|With|On|\n" +
    "|---|---|\n"+
    "|{{#team}}[{{label}}](:/{{value}}), {{/team}}|[{{project.label}}](:/{{project.value}})|\n"+
    "\n" +
    "\n" +
    "# Key Updates\n" +
    "\n" +
        "\n" +
    "# ToDos\n" +
    "\n" +
    "\n" +
    "# Overall"
