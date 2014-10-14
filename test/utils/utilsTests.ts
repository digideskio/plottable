///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("_Util.Methods", () => {
  it("inRange works correct", () => {
    assert.isTrue(Plottable._Util.Methods.inRange(0, -1, 1), "basic functionality works");
    assert.isTrue(Plottable._Util.Methods.inRange(0, 0, 1), "it is a closed interval");
    assert.isTrue(!Plottable._Util.Methods.inRange(0, 1, 2), "returns false when false");
  });

  it("sortedIndex works properly", () => {
    var a = [1,2,3,4,5];
    var si = Plottable._Util.OpenSource.sortedIndex;
    assert.equal(si(0, a), 0, "return 0 when val is <= arr[0]");
    assert.equal(si(6, a), a.length, "returns a.length when val >= arr[arr.length-1]");
    assert.equal(si(1.5, a), 1, "returns 1 when val is between the first and second elements");
  });

  it("accessorize works properly", () => {
    var datum = {"foo": 2, "bar": 3, "key": 4};

    var f = (d: any, i: number, m: any) => d + i;
    var a1 = Plottable._Util.Methods.accessorize(f);
    assert.equal(f, a1, "function passes through accessorize unchanged");

    var a2 = Plottable._Util.Methods.accessorize("key");
    assert.equal(a2(datum, 0, null), 4, "key accessor works appropriately");

    var a3 = Plottable._Util.Methods.accessorize("#aaaa");
    assert.equal(a3(datum, 0, null), "#aaaa", "strings beginning with # are returned as final value");

    var a4 = Plottable._Util.Methods.accessorize(33);
    assert.equal(a4(datum, 0, null), 33, "numbers are return as final value");

    var a5 = Plottable._Util.Methods.accessorize(datum);
    assert.equal(a5(datum, 0, null), datum, "objects are return as final value");
  });

  it("uniq works as expected", () => {
    var strings = ["foo", "bar", "foo", "foo", "baz", "bam"];
    assert.deepEqual(Plottable._Util.Methods.uniq(strings), ["foo", "bar", "baz", "bam"]);
  });

  it("max/min work as expected", () => {
    var alist = [1,2,3,4,5];
    var dbl = (x: number) => x * 2;
    var max = Plottable._Util.Methods.max;
    var min = Plottable._Util.Methods.min;
    assert.deepEqual(max(alist), 5, "max works as expected on plain array");
    assert.deepEqual(max(alist, 99), 5, "max ignores default on non-empty array");
    assert.deepEqual(max(alist, dbl), 10, "max applies function appropriately");
    assert.deepEqual(max([]), 0, "default value zero by default");
    assert.deepEqual(max([], 10), 10, "works as intended with default value");
    assert.deepEqual(max([], dbl), 0, "default value zero as expected when fn provided");
    assert.deepEqual(max([], dbl, 5), 5, "default value works with function");

    assert.deepEqual(min(alist, 0), 1, "min works for basic list");
    assert.deepEqual(min(alist, dbl, 0), 2, "min works with function arg");
    assert.deepEqual(min([]), 0, "min defaults to 0");
    assert.deepEqual(min([], dbl, 5), 5, "min accepts custom default and function");

    var strings = ["a", "bb", "ccc", "ddd"];
    assert.deepEqual(max(strings, (s: string) => s.length), 3, "works on arrays of non-numbers with a function");
    assert.deepEqual(max([], (s: string) => s.length, 5), 5, "defaults work even with non-number function type");
  });

  it("objEq works as expected", () => {
    assert.isTrue(Plottable._Util.Methods.objEq({}, {}));
    assert.isTrue(Plottable._Util.Methods.objEq({a: 5}, {a: 5}));
    assert.isFalse(Plottable._Util.Methods.objEq({a: 5, b: 6}, {a: 5}));
    assert.isFalse(Plottable._Util.Methods.objEq({a: 5}, {a: 5, b: 6}));
    assert.isTrue(Plottable._Util.Methods.objEq({a: "hello"}, {a: "hello"}));
    assert.isFalse(Plottable._Util.Methods.objEq({constructor: {}.constructor}, {}),
                  "using \"constructor\" isn't hidden");
  });

  it("populateMap works as expected", () => {
    var keys = ["a", "b", "c"];
    var map = Plottable._Util.Methods.populateMap(keys, (key) => key + "Value");

    assert.strictEqual(map.get("a"), "aValue", "key properly goes through map function");
    assert.strictEqual(map.get("b"), "bValue", "key properly goes through map function");
    assert.strictEqual(map.get("c"), "cValue", "key properly goes through map function");

    var indexMap = Plottable._Util.Methods.populateMap(keys, (key, i) => key + i + "Value");

    assert.strictEqual(indexMap.get("a"), "a0Value", "key and index properly goes through map function");
    assert.strictEqual(indexMap.get("b"), "b1Value", "key and index properly goes through map function");
    assert.strictEqual(indexMap.get("c"), "c2Value", "key and index properly goes through map function");

    var emptyKeys: string[] = [];
    var emptyMap = Plottable._Util.Methods.populateMap(emptyKeys, (key) => key + "Value");

    assert.isTrue(emptyMap.empty(), "no entries in map if no keys in input array");

  });

  it("range works as expected", () => {
    var start = 0;
    var end = 10;
    var step = 1;
    var range = Plottable._Util.Methods.range(start, end);

    var lastVal = start - step;
    range.forEach(t => {
      assert.operator(t, ">=", start,"entry is not less then start");
      assert.operator(t, "<=", end, "entry is not greater then end");
      assert.equal(t - lastVal, step, "step requirment is met");
      lastVal = t;
    });
    assert.lengthOf(range, 10, "all entries has been generated");

    step = 3;
    range = Plottable._Util.Methods.range(start, end, step);

    lastVal = start - step;
    range.forEach(t => {
      assert.operator(t, ">=", start, "entry is not less then start");
      assert.operator(t, "<=", end,   "entry is not greater then end");
      assert.equal(t - lastVal, step, "step requirment is met");
      lastVal = t;
    });
    assert.lengthOf(range, 4, "all entries has been generated");

    step = 11;
    range = Plottable._Util.Methods.range(start, end, step);
    assert.lengthOf(range, 1, "all entries has been generated");

    step = 0;
    assert.throws(() => Plottable._Util.Methods.range(start, end, step));

    step = -1;
    range = Plottable._Util.Methods.range(start, end, step);
    assert.lengthOf(range, 0, "no enries because of invalid step");

    step = -1;
    range = Plottable._Util.Methods.range(end, start, step);

    lastVal = end - step;
    range.forEach(t => {
      assert.operator(t, ">=", start,"entry is not less then start");
      assert.operator(t, "<=", end, "entry is not greater then end");
      assert.equal(t - lastVal, step, "step requirment is met");
      lastVal = t;
    });
    assert.lengthOf(range, 10, "all entries has been generated");
  });
});
