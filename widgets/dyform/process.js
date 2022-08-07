/**
 * Export the widget processes
 * Export() defined witch function in this file will be registered as YAO PROCESS
 * The process name is <WIDGET NAME>.<INSTANCE NAME>.<FUNCTION NAME>
 *
 * @todo:
 *   The processes can be used in compile.js and export.js DIRECTLY
 */

/**
 * Model
 * Convert DSL to yao model
 *
 * @debug
 *   yao run widgets.dyform.Model test '::{"name":"TEST", "decription":"A TEST DYFORM", "columns":[{"title":"First Name","name":"name","type":"input","search":true,"props":{"placeholder":"Please input your first name"}},{"title":"Amount","name":"amount","type":"input","search":true,"props":{"placeholder":"Please input amount"}},{"title":"Description","name":"desc","type":"textArea","props":{"placeholder":"Please input Description"}}]}'
 *
 * @name: widgets.dyform.Model
 * @param {String} instance the instance name
 * @param {*} payload
 */
function Model(instance, dsl) {
  const name = `dyform.${instance}`;
  return [{ name: name, dsl: toModel(instance, dsl) }];
}

/**
 * Table
 * Convert DSL to yao table
 *
 * @debug
 *   yao run widgets.dyform.Table test '::{"name":"TEST", "decription":"A TEST DYFORM", "columns":[{"title":"First Name","name":"name","type":"input","search":true,"props":{"placeholder":"Please input your first name"}},{"title":"Amount","name":"amount","type":"input","search":true,"props":{"placeholder":"Please input amount"}},{"title":"Description","name":"desc","type":"textArea","props":{"placeholder":"Please input Description"}}]}'
 *
 * @name: widgets.dyform.Model
 * @param {String} instance the instance name
 * @param {*} payload
 */
function Table(instance, dsl) {
  const name = `dyform.${instance}`;
  return [{ name: name, dsl: toTable(instance, dsl) }];
}

/**
 * Generate a model
 * @param {*} instance
 * @param {*} payload
 * @returns
 */
function toModel(instance, payload) {
  payload = payload || {};
  const tableName = `dyform_${instance}`; // the shcema table name
  const columns = payload.columns || [];
  var modelTemplate = {
    name: `AUTO GENERATE BY DYFORM ${instance}`,
    table: { name: tableName, comment: "dyform data store" },
    columns: [{ label: "ID", name: "id", type: "ID", comment: "ID" }],
    indexes: [],
  };

  columns.forEach((column) => {
    var col = castModelColumn(column);
    if (col) {
      modelTemplate.columns.push(col);
    }
  });

  return modelTemplate;
}

/**
 * Generate a table
 * @param {*} instance
 * @param {*} payload
 */
function toTable(instance, payload) {
  payload = payload || {};
  const columns = payload.columns || [];
  const modelName = `dyform.${instance}`; // the model name
  var tableTemplate = {
    name: payload.name || instance,
    version: "1.0.0",
    decription: payload.decription || "a dyform instance",
    bind: { model: modelName },
    columns: {},
    filters: {},
    list: {
      primary: "id",
      layout: { columns: [], filters: [] },
      actions: {
        pagination: { props: { showTotal: true } },
        create: { props: { label: "Create" } },
      },
      option: { operation: { unfold: true } },
    },
    edit: {
      primary: "id",
      layout: {
        fieldset: [{ columns: [] }],
      },
      actions: {
        cancel: {},
        save: {},
        delete: { type: "button", props: { label: "Delete" } },
      },
      option: { dev: true },
    },
  };

  columns.forEach((column) => {
    var col = castTableColumn(column);
    if (col) {
      col.columns.forEach((c) => (tableTemplate.columns[c.name] = c.component));
      col.filters.forEach((f) => (tableTemplate.filters[f.name] = f.filter));
      col.edit.forEach((c) =>
        tableTemplate.edit.layout.fieldset[0].columns.push(c)
      );
      col.list.columns.forEach((c) =>
        tableTemplate.list.layout.columns.push(c)
      );
      col.list.filters.forEach((f) =>
        tableTemplate.list.layout.filters.push(f)
      );
    }
  });

  return tableTemplate;
}

function castTableColumn(column) {
  column = column || {};
  const props = column.props || {};
  const title = column.title;
  const name = column.name;
  const bind = `:${name}`;
  if (!name) {
    log.Error("castTableColumn: missing name");
    return false;
  }

  if (!title) {
    log.Error("castTableColumn: missing title");
    return false;
  }

  var res = {
    columns: [],
    filters: [],
    list: { columns: [], filters: [] },
    edit: [],
  };

  // Converted to custom component, here converted to Yao table widget
  var component = {
    label: title,
    view: { type: "label", props: { value: `:${name}` } },
    edit: {},
  };

  switch (column.type) {
    case "input":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "textArea":
      component.edit = { type: "textArea", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    default:
      log.Error("castTableColumn: Type %s does not support", column.type);
      return false;
  }

  res.columns.push({ name: title, component: component });

  // Convert to filter based on DSL description
  if (column.search) {
    var filter = {
      label: title,
      bind: `where.${name}.match`,
      input: {
        type: "input",
        props: { placeholder: props.placeholder || `type ${title}...` },
      },
    };
    res.filters.push({ name: title, filter: filter });
    res.list.filters.push({ name: title });
  }

  return res;
}

function castModelColumn(column) {
  column = column || {};
  if (!column.name) {
    log.Error("castModelColumn: missing name");
    return false;
  }

  var col = {
    name: column.name,
    label: column.title,
    comment: column.title,
    index: column.search ? true : false,
  };

  // Convert to data model based on custom component type for storing data
  switch (column.type) {
    case "input":
      col.type = "string";
      col.length = 200;
      return col;
    case "textArea":
      col.type = "text";
      return col;
  }

  log.Error("castModelColumn: Type %s does not support", column.type);
  return false;
}

/**
 * Export processes
 */
function Export() {
  return { Model: "Model", Table: "Table" };
}
