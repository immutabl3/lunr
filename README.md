# lunr: search library

Based on [js-search](https://github.com/bvaughn/js-search) but updated to be ~2x faster!

Able to be used client-side and in web workers

### Installation

```bash
npm install @immutabl3/lunr
```

### Overview

At a high level you configure Js Search by telling it which fields it should index for searching and then add the
objects to be searched.

```javascript
import { Search } from '@immutabl3/lunr';

var theGreatGatsby = {
  isbn: '9781597226769',
  title: 'The Great Gatsby',
  author: {
    name: 'F. Scott Fitzgerald'
  },
  tags: ['book', 'inspirational']
};
var theDaVinciCode = {
  isbn: '0307474275',
  title: 'The DaVinci Code',
  author: {
    name: 'Dan Brown'
  },
  tags: ['book', 'mystery']
};
var angelsAndDemons = {
  isbn: '074349346X',
  title: 'Angels & Demons',
  author: {
    name: 'Dan Brown',
  },
  tags: ['book', 'mystery']
};

var search = Search('isbn');
search.addIndex('title');
search.addIndex(['author', 'name']);
search.addIndex('tags')

search.addDocuments([theGreatGatsby, theDaVinciCode, angelsAndDemons]);

search.search('The');    // [theGreatGatsby, theDaVinciCode]
search.search('scott');  // [theGreatGatsby]
search.search('dan');    // [angelsAndDemons, theDaVinciCode]
search.search('mystery') // [angelsAndDemons, theDaVinciCode]
```

for additional documentation see [js-search](https://github.com/bvaughn/js-search)

# Performance

```
js-search x 590 ops/sec ±2.01% (89 runs sampled)
immutabl3/lunr x 1,212 ops/sec ±2.19% (87 runs sampled)
```

### Library Size

As of version `1.0.0` the payload added to your app is rather small. Served using gzip compression, lunr will add less than `1.2k` to your total bundle size:

<dl>
  <dt>minified</dt><dd>`~2.7kB`</dd>
  <dt>gzipped</dt><dd>`~1.2kB`</dd>
  <dt>brotli'd</dt><dd>`~1kB`</dd>
</dl>

# License

[MIT](https://github.com/immutabl3/lunr/blob/master/LICENSE)