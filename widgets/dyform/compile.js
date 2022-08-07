/**
 * The DSL compiler.
 * Translate the customize DSL to Models, Processes, Flows, Tables, etc.
 */

/**
 * Source
 * Where to get the source of DSL
 */
function Source() {
  var sources = {};
  tpls = Process("models.template.Get", { select: ["id", "dsl"], limit: 2000 });
  if (tpls.code && tpls.message) {
    log.Error("Load dyform sources: %s", tpls.message);
    return sources;
  }

  tpls.forEach((tpl) => {
    tpl = tpl || {};
    try {
      instance = `instance_${tpl.id}`;
      dsl = JSON.parse(tpl.dsl);
      sources[instance] = dsl;
    } catch (e) {
      log.Error("Source %v DSL: %s", tpl.id, e.message);
      return;
    }
  });

  return sources;
}

/**
 * Compile
 * Translate or extend the customize DSL
 * @param {*} dsl
 */
function Compile(name, dsl) {
  return dsl;
}

/**
 * OnLoad
 * When the widget instance are loaded, the function will be called.
 * For preparing the sources the widget need.
 * @param {DSL} dsl
 */
function OnLoad(name, dsl) {
  log.Info("[Widget] dyform %s loaded", name);
}

/**
 * Migrate
 * When the migrate command executes, the function will be called
 * @param {DSL} dsl
 * @param {bool} force
 */
function Migrate(dsl, force) {}
