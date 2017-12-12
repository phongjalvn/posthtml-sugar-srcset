const assert = require('power-assert');
const posthtml = require('../../posthtml');
const options = require('../../../lib/options');

const case1 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  }
});

const case2 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 640
  }
});

const case3 = options({
  responsive: {
    src: true,
    width: [320, 640],
    // srcReplace: -1 // default value
  }
});

const case4 = options({
  responsive: {
    src: true,
    srcset: false,
    width: [320, 640],
    srcReplace: 320
  }
});

const case5 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  },
  replace: { defaultSizes: '(max-width: 700px) 50vw, 700px' }
});

const case6 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  },
  replace: { test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' }
});

const case7 = options({
  responsive: {
    src: true,
    width: [320, 640],
    srcReplace: 320
  },
  replace: { defaultSizes: '(max-width: 700px) 50vw, 700px', test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' }
});

describe('srcset', () => {

  it(`Basic src pattern.(width) use [case1]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case1), correct);
  });

  it(`Basic src pattern.(width) use [case2 - responsiveSrcReplace: 640 -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-640w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case2), correct);
  });

  it(`Basic src pattern.(width) use [case3 - responsiveSrcReplace: -1 -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case3), correct);
  });

  it(`Basic src pattern.(width) use [case4 - responsive: { src: true, srcset: false } -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;

    assert.equal(await posthtml(html, case4), correct);
  });

  it(`Basic src pattern.(width) use [case5 - replace: { defaultSizes: '(max-width: 700px) 50vw,700px' } -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w" sizes="(max-width: 700px) 50vw, 700px">`;

    assert.equal(await posthtml(html, case5), correct);
  });

  it(`Basic src pattern.(width) use [case6 - replace: { test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' } -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case6), correct);
  });

  it(`Basic src pattern.(width) use [case7 - case 5 + 6 -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w" sizes="(max-width: 700px) 50vw, 700px">`;

    assert.equal(await posthtml(html, case7), correct);
  });


  it(`Mixed.(width) use [case1]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w,path/to/filename.png 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename.png 1200w">`;

    assert.equal(await posthtml(html, case1), correct);
  });

  it(`Mixed.(width) use [case4 - responsive: { src: true, srcset: false } -]`, async () => {
    const html = `<img src="path/to/filename.png" srcset="320w, 640w,path/to/filename.png 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" srcset="path/to/filename.png 1200w">`;

    assert.equal(await posthtml(html, case4), correct);
  });


  it(`Not change sizes.(width) use [case1]`, async () => {
    const html = `<img src="path/to/filename.png" sizes="50vw" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="50vw" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case1), correct);
  });

  it(`Not change sizes.(width) use [case5 - replace: { defaultSizes: '(max-width: 700px) 50vw,700px' } -]`, async () => {
    const html = `<img src="path/to/filename.png" sizes="50vw" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="50vw" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case5), correct);
  });


  it(`Multi sizes.(width) use [case5 - replace: { defaultSizes: '(max-width: 700px) 50vw,700px' } -]`, async () => {
    const html = `<img src="path/to/filename.png" sizes="test, test2, test3" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="test, test2, test3" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case5), correct);
  });

  it(`Multi sizes.(width) use [case6 - replace: { test: '(max-width: 700px) 50vw', test2: '(max-width: 1000px) 80vw', test3: '500px' } -]`, async () => {
    const html = `<img src="path/to/filename.png" sizes="test, test2, test3" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="(max-width: 700px) 50vw,(max-width: 1000px) 80vw,500px" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case6), correct);
  });

  it(`Multi sizes.(width) use [case7 - case 5 + 6 -]`, async () => {
    const html = `<img src="path/to/filename.png" sizes="test, test2, test3" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="(max-width: 700px) 50vw,(max-width: 1000px) 80vw,500px" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case7), correct);
  });

  it(`Mix sizes.(width) use [case7 - case 5 + 6 -]`, async () => {
    const html = `<img src="path/to/filename.png" sizes="test, test2, 1000px" srcset="320w, 640w, 1200w">`;
    const correct = `<img src="path/to/filename-320w.png" sizes="(max-width: 700px) 50vw,(max-width: 1000px) 80vw, 1000px" srcset="path/to/filename-320w.png 320w,path/to/filename-640w.png 640w,path/to/filename-1200w.png 1200w">`;

    assert.equal(await posthtml(html, case7), correct);
  });

});
