const jsonpatch = require('./../../lib/core');
var obj;

describe('root replacement with applyPatch', function() {
  describe('add operation', function() {
    it('should `add` an object (on a json document of type object)) - in place', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: {
          hello: 'universe'
        }
      }]);

      expect(newObj).toEqual({
        hello: 'universe'
      });
    });
    it('should `add` an object (on a json document of type object) - and return', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: {
          hello: 'universe'
        }
      }]);
      expect(newObj).toEqual({
        hello: 'universe'
      });
    });
    it('should `add` an object (on a json document of type array) - and return', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: {
          hello: 'universe'
        }
      }]);
      expect(newObj).toEqual({
        hello: 'universe'
      });
    });
    it('should `add` an array (on a json document of type array) - in place', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: [
          {
            hello: 'universe'
          }
        ]
      }]);
      expect(newObj).toEqual([
        {
          hello: 'universe'
        }
      ]);
    });
    it('should `add` an array (on a json document of type array) - and return', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: [
          {
            hello: 'universe'
          }
        ]
      }]);
      expect(newObj).toEqual([
        {
          hello: 'universe'
        }
      ]);
    });
     it('should `add` an array prop', function() {
      var obj = [];

      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '/prop',
        value: 'arrayProp'
      }]);

      expect(newObj.prop).toEqual('arrayProp');
    });
    it('should `replace` an array prop', function() {
      var obj = [];
      obj.prop = 'oldArrayProp';

      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'replace',
        path: '/prop',
        value: 'arrayProp'
      }]);

      expect(newObj.prop).toEqual('arrayProp');
    });
    it('should `add` an array (on a json document of type object) - and return', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: [
          {
            hello: 'universe'
          }
        ]
      }]);
      expect(newObj).toEqual([
        {
          hello: 'universe'
        }
      ]);
    });
    it('should `add` a primitive (on a json document of type object) - and return', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: 1
      }]);
      expect(newObj).toEqual(1);
    });
    it('should `add` with a primitive (on a json document of type array) - and return', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: 1
      }]);
      expect(newObj).toEqual(1);
    });
  });
  describe('replace operation', function() {
    it('should `replace` with an object (on a json document of type object)', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'replace',
        path: '',
        value: {
          hello: 'universe'
        }
      }]);
      expect(newObj).toEqual({
        hello: 'universe'
      });
    });
    it('should `replace` with an object (on a json document of type array)', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'replace',
        path: '',
        value: {
          hello: 'universe'
        }
      }]);
      expect(newObj).toEqual({
        hello: 'universe'
      });
    });
    it('should `replace` with an array (on a json document of type array)', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'replace',
        path: '',
        value: [
          {
            hello: 'universe'
          }
        ]
      }]);
      expect(newObj).toEqual([
        {
          hello: 'universe'
        }
      ]);
    });
    it('should `replace` with an array (on a json document of type object)', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'replace',
        path: '',
        value: [
          {
            hello: 'universe'
          }
        ]
      }]);
      expect(newObj).toEqual([
        {
          hello: 'universe'
        }
      ]);
    });
    it('should `replace` with a primitive (on a json document of type object)', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'add',
        path: '',
        value: 1
      }]);
      expect(newObj).toEqual(1);
    });
    it('should `replace` with a primitive (on a json document of type array)', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'replace',
        path: '',
        value: 1
      }]);
      expect(newObj).toEqual(1);
    });
  });
  describe('remove operation', function() {
    it('should `remove` root (on a json document of type array)', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'remove',
        path: ''
      }]);
      expect(newObj).toEqual(null);
    });
    it('should `remove` root (on a json document of type object)', function() {
      var obj = {
        hello: 'world'
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'remove',
        path: ''
      }]);
      expect(newObj).toEqual(null);
    });
  });

  describe('move operation', function() {
    it('should `move` a child of type object to root (on a json document of type object)', function() {
      var obj = {
        child: { name: 'Charles' }
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'move',
        from: '/child',
        path: ''
      }]);
      expect(newObj).toEqual({ name: 'Charles' });
    });
    it('should `move` a child of type object to root (on a json document of type array)', function() {
      var obj = {
        child: [{ name: 'Charles' }]
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'move',
        from: '/child/0',
        path: ''
      }]);
      expect(newObj).toEqual({ name: 'Charles' });
    });
    it('should `move` a child of type array to root (on a json document of type object)', function() {
      var obj = {
        child: [{ name: 'Charles' }]
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'move',
        from: '/child',
        path: ''
      }]);
      expect(newObj).toEqual([{ name: 'Charles' }]);
    });
  });
  describe('copy operation', function() {
    it('should `copy` a child of type object to root (on a json document of type object) - and return', function() {
      var obj = {
        child: { name: 'Charles' }
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'copy',
        from: '/child',
        path: ''
      }]);
      expect(newObj).toEqual({ name: 'Charles' });
    });
    it('should `copy` a child of type object to root (on a json document of type array) - and return', function() {
      var obj = {
        child: [{ name: 'Charles' }]
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'copy',
        from: '/child/0',
        path: ''
      }]);
      expect(newObj).toEqual({ name: 'Charles' });
    });
    it('should `copy` a child of type array to root (on a json document of type object) - and return', function() {
      var obj = {
        child: [{ name: 'Charles' }]
      };
      var newObj = jsonpatch.applyPatch(obj, [{
        op: 'copy',
        from: '/child',
        path: ''
      }]);
      expect(newObj).toEqual([{ name: 'Charles' }]);
    });
  });
  describe('test operation', function() {
    it('should `test` against root (on a json document of type object) - and return true', function() {
      var obj = {
        hello: 'world'
      };
      var result = jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '',
        value: {
          hello: 'world'
        }
      }]);
      expect(result).toEqual(obj);
    });
    it('should `test` against root (on a json document of type object) - and return false', function() {
      var obj = {
        hello: 'world'
      };
      expect(() =>
        jsonpatch.applyPatch(obj, [{
          op: 'test',
          path: '',
          value: 1
        }])
      ).toThrow();
    });
    it('should `test` against root (on a json document of type array) - and return false', function() {
      var obj = [
        {
          hello: 'world'
        }
      ];

      expect(() =>
        jsonpatch.applyPatch(obj, [{
          op: 'test',
          path: '',
          value: 1
        }])
      ).toThrow();
    });
  });
});
describe('core - using applyPatch', function() {
  it('should apply add', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'add',
      path: '/bar',
      value: [1, 2, 3, 4]
    }]);
    expect(newObj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: [1, 2, 3, 4]
    });
    var newObj2 = jsonpatch.applyPatch(newObj, [{
      op: 'add',
      path: '/baz/0/foo',
      value: 'world'
    }]);
    expect(newObj2).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello',
          foo: 'world'
        }
      ],
      bar: [1, 2, 3, 4]
    });

    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    var newObj3 = jsonpatch.applyPatch(obj, [{
      op: 'add',
      path: '/bar',
      value: true
    }]);
    expect(newObj3).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: true
    });

    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    var newObj4 = jsonpatch.applyPatch(obj, [{
      op: 'add',
      path: '/bar',
      value: false
    }]);
    expect(newObj4).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: false
    });

    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    var newObj5 = jsonpatch.applyPatch(obj, [{
      op: 'add',
      path: '/bar',
      value: null
    }]);
    expect(newObj5).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: null
    });
  });

  it('should apply add on root', function() {
    var obj = {
      hello: 'world'
    };
    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'add',
      path: '',
      value: {
        hello: 'universe'
      }
    }]);
    expect(newObj).toEqual({
      hello: 'universe'
    });
  });

  it('should apply remove', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: [1, 2, 3, 4]
    };

    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'remove',
      path: '/bar'
    }]);
    expect(newObj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    });
    var newObj2 = jsonpatch.applyPatch(newObj, [{
      op: 'remove',
      path: '/baz/0/qux'
    }]);
    expect(newObj2).toEqual({
      foo: 1,
      baz: [{}]
    });
  });
  it('should apply replace', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'replace',
      path: '/foo',
      value: [1, 2, 3, 4]
    }]);
    expect(newObj).toEqual({
      foo: [1, 2, 3, 4],
      baz: [
        {
          qux: 'hello'
        }
      ]
    });
    var newObj2 = jsonpatch.applyPatch(newObj, [{
      op: 'replace',
      path: '/baz/0/qux',
      value: 'world'
    }]);
    expect(newObj2).toEqual({
      foo: [1, 2, 3, 4],
      baz: [
        {
          qux: 'world'
        }
      ]
    });
  });
  it('should apply replace on root', function() {
    var obj = {
      hello: 'world'
    };
    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'replace',
      path: '',
      value: {
        hello: 'universe'
      }
    }]);

    expect(newObj).toEqual({
      hello: 'universe'
    });
  });
  it('should apply test', function() {
    obj = {
      foo: {
        bar: [1, 2, 5, 4]
      },
      bar: {
        a: 'a',
        b: 42,
        c: null,
        d: true
      }
    };
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/foo',
        value: {
          bar: [1, 2, 5, 4]
        }
      }])
    ).toEqual(obj);

    expect(() =>
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/foo',
        value: 1
      }])
    ).toThrow();

    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar',
        value: {
          d: true,
          b: 42,
          c: null,
          a: 'a'
        }
      }])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar',
        value: obj.bar
      }])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar/a',
        value: 'a'
      }])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar/b',
        value: 42
      }])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar/c',
        value: null
      }])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar/d',
        value: true
      }])
    ).toEqual(obj);
    expect(() =>
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar/d',
        value: false
      }])
    ).toThrow();
    expect(() =>
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '/bar',
        value: {
          d: true,
          b: 42,
          c: null,
          a: 'a',
          foo: 'bar'
        }
      }])
    ).toThrow();
  });

  it('should apply test on root', function() {
    var obj = {
      hello: 'world'
    };
    expect(
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '',
        value: {
          hello: 'world'
        }
      }])
    ).toEqual(obj);
    expect(() =>
      jsonpatch.applyPatch(obj, [{
        op: 'test',
        path: '',
        value: 1
      }])
    ).toThrow();
  });

  it('should apply move', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };

    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'move',
      from: '/foo',
      path: '/bar'
    }]);
    expect(newObj).toEqual({
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: 1
    });

    var newObj2 = jsonpatch.applyPatch(newObj, [{
      op: 'move',
      from: '/baz/0/qux',
      path: '/baz/1'
    }]);

    expect(newObj2).toEqual({
      baz: [{}, 'hello'],
      bar: 1
    });
  });

  it('should apply move on root', function() {
    //investigate if this test is right (https://github.com/Starcounter-Jack/JSON-Patch/issues/40)
    var obj = {
      hello: 'world',
      location: {
        city: 'Vancouver'
      }
    };
    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'move',
      from: '/location',
      path: ''
    }]);

    expect(newObj).toEqual({
      city: 'Vancouver'
    });
  });

  it('should apply copy', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };

    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'copy',
      from: '/foo',
      path: '/bar'
    }]);

    expect(newObj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: 1
    });

    var newObj2 = jsonpatch.applyPatch(newObj, [{
      op: 'copy',
      from: '/baz/0/qux',
      path: '/baz/1'
    }]);

    expect(newObj2).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        },
        'hello'
      ],
      bar: 1
    });
  });

  it('should apply copy on root', function() {
    var obj = {
      hello: 'world',
      location: {
        city: 'Vancouver'
      }
    };
    var newObj = jsonpatch.applyPatch(obj, [{
      op: 'copy',
      from: '/location',
      path: ''
    }]);
    expect(newObj).toEqual({
      city: 'Vancouver'
    });
  });
});

describe('core', function() {
  it('should apply add', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    jsonpatch.applyPatch(obj, [
      {
        op: 'add',
        path: '/bar',
        value: [1, 2, 3, 4]
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: [1, 2, 3, 4]
    });

    jsonpatch.applyPatch(obj, [
      {
        op: 'add',
        path: '/baz/0/foo',
        value: 'world'
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello',
          foo: 'world'
        }
      ],
      bar: [1, 2, 3, 4]
    });
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    jsonpatch.applyPatch(obj, [
      {
        op: 'add',
        path: '/bar',
        value: true
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: true
    });

    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    jsonpatch.applyPatch(obj, [
      {
        op: 'add',
        path: '/bar',
        value: false
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: false
    });

    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };
    jsonpatch.applyPatch(obj, [
      {
        op: 'add',
        path: '/bar',
        value: null
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: null
    });
  });

  it('should apply add on root', function() {
    var obj = {
      hello: 'world'
    };
    var newObj = jsonpatch.applyPatch(obj, [
      {
        op: 'add',
        path: '',
        value: {
          hello: 'universe'
        }
      }
    ]);

    expect(newObj).toEqual({
      hello: 'universe'
    });
  });

  it('should apply remove', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: [1, 2, 3, 4]
    };
    //jsonpatch.listenTo(obj,[]);

    jsonpatch.applyPatch(obj, [
      {
        op: 'remove',
        path: '/bar'
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    });

    jsonpatch.applyPatch(obj, [
      {
        op: 'remove',
        path: '/baz/0/qux'
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [{}]
    });
  });

  it('should apply replace', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };

    jsonpatch.applyPatch(obj, [
      {
        op: 'replace',
        path: '/foo',
        value: [1, 2, 3, 4]
      }
    ]);
    expect(obj).toEqual({
      foo: [1, 2, 3, 4],
      baz: [
        {
          qux: 'hello'
        }
      ]
    });

    jsonpatch.applyPatch(obj, [
      {
        op: 'replace',
        path: '/baz/0/qux',
        value: 'world'
      }
    ]);
    expect(obj).toEqual({
      foo: [1, 2, 3, 4],
      baz: [
        {
          qux: 'world'
        }
      ]
    });
  });

  it('should apply replace on root', function() {
    var obj = {
      hello: 'world'
    };
    var newObject = jsonpatch.applyPatch(obj, [
      {
        op: 'replace',
        path: '',
        value: {
          hello: 'universe'
        }
      }
    ]);

    expect(newObject).toEqual({
      hello: 'universe'
    });
  });

  it('should apply test', function() {
    obj = {
      foo: {
        bar: [1, 2, 5, 4]
      },
      bar: {
        a: 'a',
        b: 42,
        c: null,
        d: true
      }
    };
    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/foo',
          value: {
            bar: [1, 2, 5, 4]
          }
        }
      ])
    ).toEqual(obj);

    expect(() =>
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/foo',
          value: [1, 2]
        }
      ])
    ).toThrow();

    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar',
          value: {
            d: true,
            b: 42,
            c: null,
            a: 'a'
          }
        }
      ])
    ).toEqual(obj);

    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar',
          value: obj.bar
        }
      ])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar/a',
          value: 'a'
        }
      ])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar/b',
          value: 42
        }
      ])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar/c',
          value: null
        }
      ])
    ).toEqual(obj);
    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar/d',
          value: true
        }
      ])
    ).toEqual(obj);
    expect(() =>
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar/d',
          value: false
        }
      ])
    ).toThrow();
    expect(() =>
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '/bar',
          value: {
            d: true,
            b: 42,
            c: null,
            a: 'a',
            foo: 'bar'
          }
        }
      ])
    ).toThrow();
  });

  it('should apply test on root', function() {
    var obj = {
      hello: 'world'
    };
    expect(
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '',
          value: {
            hello: 'world'
          }
        }
      ])
    ).toEqual(obj);
    expect(() =>
      jsonpatch.applyPatch(obj, [
        {
          op: 'test',
          path: '',
          value: {
            hello: 'universe'
          }
        }
      ])
    ).toThrow();
  });

  it('should apply move', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };

    jsonpatch.applyPatch(obj, [
      {
        op: 'move',
        from: '/foo',
        path: '/bar'
      }
    ]);
    expect(obj).toEqual({
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: 1
    });

    jsonpatch.applyPatch(obj, [
      {
        op: 'move',
        from: '/baz/0/qux',
        path: '/baz/1'
      }
    ]);
    expect(obj).toEqual({
      baz: [{}, 'hello'],
      bar: 1
    });
  });

  it('should apply move on root', function() {
    //investigate if this test is right (https://github.com/Starcounter-Jack/JSON-Patch/issues/40)
    var obj = {
      hello: 'world',
      location: {
        city: 'Vancouver'
      }
    };
    var newObj = jsonpatch.applyPatch(obj, [
      {
        op: 'move',
        from: '/location',
        path: ''
      }
    ]);

    expect(newObj).toEqual({
      city: 'Vancouver'
    });
  });

  it('should apply copy', function() {
    obj = {
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ]
    };

    jsonpatch.applyPatch(obj, [
      {
        op: 'copy',
        from: '/foo',
        path: '/bar'
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        }
      ],
      bar: 1
    });

    jsonpatch.applyPatch(obj, [
      {
        op: 'copy',
        from: '/baz/0/qux',
        path: '/baz/1'
      }
    ]);
    expect(obj).toEqual({
      foo: 1,
      baz: [
        {
          qux: 'hello'
        },
        'hello'
      ],
      bar: 1
    });
  });

  it('should apply copy on root', function() {
    var obj = {
      hello: 'world',
      location: {
        city: 'Vancouver'
      }
    };
    var newObj = jsonpatch.applyPatch(obj, [
      {
        op: 'copy',
        from: '/location',
        path: ''
      }
    ]);

    expect(newObj).toEqual({
      city: 'Vancouver'
    });
  });

  it('should apply copy, without leaving cross-reference between nodes', function() {
    var obj = {};
    var patchset = [
      {op: 'add', path: '/foo', value: []},
      {op: 'add', path: '/foo/-', value: 1},
      {op: 'copy', from: '/foo', path: '/bar'},
      {op: 'add', path: '/bar/-', value: 2}
    ];

    jsonpatch.applyPatch(obj, patchset);

    expect(obj).toEqual({
      "foo": [1],
      "bar": [1, 2],
    });
  });

  it('should use value object as a reference', function () {
    var obj1 = {};
    var patch = [
      {op: 'add', path: '/foo', value: []}
    ];

    jsonpatch.applyPatch(obj1, patch, false);

    expect(obj1.foo).toBe(patch[0].value);
  });

});

describe('undefined - JS to JSON projection / JSON to JS extension', function() {
  describe('jsonpatch should apply', function() {
    it('add for properties already set to `undefined` in target JS document', function() {
      var obj = {
        hello: 'world',
        nothing: undefined
      };
      jsonpatch.applyPatch(obj, [
        {
          op: 'add',
          path: '/nothing',
          value: 'defined'
        }
      ]);

      expect(obj).toEqual({
        hello: 'world',
        nothing: 'defined'
      });
    });

    it('add for properties with value set to `undefined` (extension)', function() {
      var obj = {
        hello: 'world'
      };
      jsonpatch.applyPatch(obj, [
        {
          op: 'add',
          path: '/nothing',
          value: undefined
        }
      ]);

      expect(obj).toEqual({
        hello: 'world',
        nothing: undefined
      });
    });

    it('remove on element already set to `undefined`, and remove it completely', function() {
      obj = {
        foo: 1,
        not: undefined
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'remove',
          path: '/not'
        }
      ]);
      expect(obj).toEqual({
        foo: 1
      });
    });
    it('remove on array element set to `undefined`', function() {
      obj = {
        foo: 1,
        bar: [0, 1, undefined, 3]
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'remove',
          path: '/bar/2'
        }
      ]);
      expect(obj).toEqual({
        foo: 1,
        bar: [0, 1, 3]
      });
    });

    it('replace on element set to `undefined`', function() {
      obj = {
        foo: 1,
        not: undefined
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'replace',
          path: '/not',
          value: 'defined'
        }
      ]);
      expect(obj).toEqual({
        foo: 1,
        not: 'defined'
      });
    });
    it('replace on array element set to `undefined`', function() {
      obj = {
        foo: 1,
        bar: [0, 1, undefined, 3]
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'replace',
          path: '/bar/2',
          value: 'defined'
        }
      ]);
      expect(obj).toEqual({
        foo: 1,
        bar: [0, 1, 'defined', 3]
      });
    });
    it('replace element with `undefined` (extension)', function() {
      obj = {
        foo: 1
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'replace',
          path: '/foo',
          value: undefined
        }
      ]);
      expect(obj).toEqual({
        foo: undefined
      });
    });
    it('replace array element with `undefined` (extension)', function() {
      obj = {
        foo: 1,
        bar: [0, 1, 2, 3]
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'replace',
          path: '/bar/2',
          value: undefined
        }
      ]);
      expect(obj).toEqual({
        foo: 1,
        bar: [0, 1, undefined, 3]
      });
    });
    it('test on element set to `undefined`', function() {
      obj = {
        foo: 1,
        not: undefined
      };
      expect(() =>
        jsonpatch.applyPatch(obj, [
          {
            op: 'test',
            path: '/not',
            value: 'defined'
          }
        ])
      ).toThrow();
      expect(
        jsonpatch.applyPatch(obj, [
          {
            op: 'test',
            path: '/not',
            value: undefined
          }
        ])
      ).toEqual(obj);
    });
    it('test on array element set to `undefined`', function() {
      obj = {
        foo: 1,
        bar: [0, 1, undefined, 3]
      };
      expect(() =>
        jsonpatch.applyPatch(obj, [
          {
            op: 'test',
            path: '/bar/2',
            value: 'defined'
          }
        ])
      ).toThrow();
      expect(() =>
        jsonpatch.applyPatch(obj, [
          {
            op: 'test',
            path: '/bar/2',
            value: null
          }
        ])
      ).toThrow();
      expect(
        jsonpatch.applyPatch(obj, [
          {
            op: 'test',
            path: '/bar/2',
            value: undefined
          }
        ])
      ).toEqual(obj);
    });

    it('move of `undefined`', function() {
      obj = {
        foo: undefined,
        baz: 'defined'
      };

      jsonpatch.applyPatch(obj, [
        {
          op: 'move',
          from: '/foo',
          path: '/bar'
        }
      ]);
      expect(obj).toEqual({
        baz: 'defined',
        bar: undefined
      });

      jsonpatch.applyPatch(obj, [
        {
          op: 'move',
          from: '/bar',
          path: '/baz'
        }
      ]);
      expect(obj).toEqual({
        baz: undefined
      });
    });

    it('copy of `undefined` as `null` (like `JSON.stringify` does)', function() {
      obj = {
        foo: undefined,
        baz: 'defined'
      };
      jsonpatch.applyPatch(obj, [
        {
          op: 'copy',
          from: '/foo',
          path: '/bar'
        }
      ]);
      expect(obj).toEqual({
        foo: undefined,
        baz: 'defined',
        bar: null
      });

      jsonpatch.applyPatch(obj, [
        {
          op: 'copy',
          from: '/bar',
          path: '/baz'
        }
      ]);
      expect(obj).toEqual({
        foo: undefined,
        baz: null,
        bar: null
      });
    });
  });
});
