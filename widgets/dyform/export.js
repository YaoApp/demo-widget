/**
 * Export Models, APIs, Tables, Tasks, Schedules, etc.
 */

/**
 * Export API
 */
function APIs() {}

/**
 * Export Models
 * @param {*} name
 * @param {*} dsl
 */
function Models(name, dsl) {
  var exportModels = {};
  const models = Process("widgets.dyform.Model", name, dsl);
  models.forEach((model) => {
    exportModels[model.name] = model.dsl;
  });
  return exportModels;
}

/**
 * Export Tables
 * @param {*} name
 * @param {*} dsl
 */
function Tables(name, dsl) {
  var exportTables = {};
  const tables = Process("widgets.dyform.Table", name, dsl);
  tables.forEach((table) => {
    exportTables[table.name] = table.dsl;
  });
  return exportTables;
}
