/**
 * AfterSave Hook: upgrade the instance shcema
 */
function AfterSave(id, payload) {
  payload = payload || {};
  if (!payload.dsl) {
    return id;
  }

  var dsl = {};
  try {
    dsl = JSON.parse(payload.dsl);
  } catch (e) {
    log.Error("After Save: %s", e.message);
    return id;
  }

  // Save schema
  const instance = `instance_${id}`;
  var res = Process("widgets.dyform.Save", instance, dsl);
  if (!res) {
    log.Error("After Save: upgrade schema error");
    return id;
  }

  // Add Menu items
  setMenu(instance, dsl.name ? dsl.name : instance);

  return id;
}

/**
 * AfterDelete Hook: remove the instance shcema
 */
function AfterDelete(params, id) {
  // Remove schema
  const instance = `instance_${id}`;
  Process("widgets.dyform.Delete", instance);
  removeMenu(instance);
  return id;
}

/**
 * AfterFind Hook: transform the DSL format to the form editor needs
 * @param {*} id
 * @param {*} template
 */
function AfterFind(template, id) {
  let dsl = JSON.parse(template["dsl"]);
  let columns = dsl.columns || [];
  let types = { input: "Input", select: "Select" };

  template["dsl"] = [];
  columns.forEach((column) => {
    // let props = column.props || {};
    // let search = props.showSearch ? true : false;
    template["dsl"].push({
      title: column.title,
      bind: column.name,
      id: types[column.type],
      props: column.props || {},
      search: true,
      width: 6,
      chosen: false,
      selected: false,
    });
  });

  return template;
}

/**
 * BeforSave Hook: transform the form editor data to the DSL
 * @param {*} payload
 */
function BeforeSave(payload) {
  payload = payload || {};
  columns = payload.dsl || [];
  payload["dsl"] = { columns: [], name: payload.name || "UNTITLE" };
  columns.forEach((column) => {
    let type = column.id || "";
    payload["dsl"].columns.push({
      title: column.title || "UNTITLE",
      name: column.bind,
      type: type.toLowerCase(),
      props: column.props || {},
    });
  });
  payload["dsl"] = JSON.stringify(payload["dsl"]);
  return [payload];
}

/**
 * Remove menu item
 * @debug
 *  yao run scripts.template.removeMenu instance_1
 *
 * @param {*} instance
 */
function removeMenu(instance) {
  const path = `/table/dyform.${instance}`;
  Process("models.xiang.menu.DestroyWhere", {
    wheres: [{ column: "path", value: path }],
  });
}

/**
 * Set Menu
 *
 * @debug
 *  yao run scripts.template.setMenu instance_1 Foo
 *
 * @param {*} instance
 * @param {*} title
 * @returns
 */
function setMenu(instance, title) {
  var parentItem = new Query().Get({
    select: ["id"],
    from: "xiang_menu",
    wheres: [{ ":name": "名称", "=": "Tables" }],
    limit: 1,
  });

  var parent_id = parentItem.length > 0 ? parentItem[0].id : null;
  if (parent_id == null) {
    return;
  }

  const path = `/table/dyform.${instance}`;
  var menu = {
    name: title,
    parent: parent_id,
    path: path,
    rank: 1,
    status: "enabled",
    visible_menu: 1,
    blocks: 0,
  };

  var items = Process("models.xiang.menu.Get", {
    select: ["id"],
    wheres: [{ column: "path", value: path }],
    limit: 1,
  });

  if (items.code && items.message) {
    log.Error("After Save: save menu %s", items.message);
    return id;
  }

  if (items.length > 0) {
    menu["id"] = items[0].id;
  }

  Process("models.xiang.menu.Save", menu);
}
