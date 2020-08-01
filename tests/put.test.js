const put = require("../put.js");

test("put value into simple path", () => {
  const obj = {};
  const path = "a.b.c";
  put(obj, path, "value");
  expect(obj.a.b.c).toBe("value");
});

test("put value into array", () => {
  const obj = {};
  const path = "a.b[]";
  put(obj, path, "value");
  expect(Array.isArray(obj.a.b)).toBe(true);
  expect(obj.a.b[0]).toBe("value");

  put(obj, path, "value2");
  expect(obj.a.b[1]).toBe("value2");
});

test("put value into array with index", () => {
  const obj = {};
  const path = "a.b[1]";

  put(obj, path, "value");
  expect(Array.isArray(obj.a.b)).toBe(true);
  expect(obj.a.b[1]).toBe("value");
});


test("put value into object in an array", () => {
    const obj = {};
    const path = "a.b[1].c";

    put(obj, path, 'value');
    expect(obj.a.b[1].c).toBe("value");
});

test('put value into object in an array, merging would work instead of creating new obj', ()=>{
    const obj = {};
    put(obj, 'a.b[1].c', 'value');
    put(obj, 'a.b[1].d', 'value2');

    expect(obj.a.b[1].c).toBe('value');
    expect(obj.a.b[1].d).toBe('value2');
});
