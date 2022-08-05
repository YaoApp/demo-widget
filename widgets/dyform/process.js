/**
 * Export the widget processes
 * Export() defined witch function in this file will be registered as YAO PROCESS
 * The process name is <WIDGET NAME>.<INSTANCE NAME>.<FUNCTION NAME>
 * The processes can be used in compile.js and export.js DIRECTLY
 */

/**
 * Save Schema
 * Save the schema of dyform
 * @name: dyform.<INSTANCE>.Save
 * @param {String} instance the instance name
 * @param {*} payload
 */
function Save(instance, payload) {
  // Checking Template
  console.log("Save");

  return { instance: instance, payload: payload };
}

/**
 * Export processes
 */
function Export() {
  return { Save: "Save" };
}
