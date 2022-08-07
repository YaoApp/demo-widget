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
  return id;
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
