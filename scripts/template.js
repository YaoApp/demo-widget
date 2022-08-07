/**
 * AfterSave Hook: upgrade the instance shcema
 */
function AfterSave(id, payload) {
  payload = payload || {};
  if (!payload.dsl) {
    return id;
  }

  try {
    dsl = JSON.parse(payload.dsl);
  } catch (e) {
    log.Error("After Save: %s", e.message);
    return id;
  }

  // Save schema
  const instance = `instance_${id}`;
  Process("widgets.dyform.Save", instance, dsl);
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
