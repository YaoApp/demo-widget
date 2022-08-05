/**
 * The DSL compiler.
 * Translate the customize DSL to Models, Processes, Flows, Tables, etc.
 */

/**
 * Source
 * Where to get the source of DSL
 */
function Source() {
  return {};
}

/**
 * Compile
 * Translate or extend the customize DSL
 * @param {*} dsl
 */
function Compile(name, dsl) {
  let newdsl = { name: name };
  return newdsl;
}

/**
 * OnLoad
 * When the widget instance are loaded, the function will be called.
 * For preparing the sources the widget need.
 * @param {DSL} dsl
 */
function OnLoad(name, dsl) {
  // console.log(name, dsl);
}

/**
 * Migrate
 * When the migrate command executes, the function will be called
 * @param {DSL} dsl
 * @param {bool} force
 */
function Migrate(dsl, force) {}
