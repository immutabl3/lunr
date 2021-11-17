import { promises as fs} from 'fs';
import path from 'path';
import { Search as JsSearch } from 'js-search';
import * as search from '../dist/index.cjs';
import Benchmark from 'benchmark';

const file = await fs.readFile(path.resolve(process.cwd(), 'bench/books.json'));
const books = JSON.parse(file.toString());

const { default: { Search } } = search;

const suite = new Benchmark.Suite()
  .on('cycle', e => console.log(`${e.target}`))
  .on('abort', err => {
    console.error('abort', err);
  })
  .on('error', err => {
    console.error('error', err);
  });

(function() {
  const search = new JsSearch('isbn');
  search.addIndex('title');
  search.addIndex('author');
  search.addDocuments(books);
  suite.add('js-search', () => {
    search.search('the');
    search.search('an');
    search.search('of');
  });
}());

(function() {
  const search = Search('isbn');
  search.addIndex('title');
  search.addIndex('author');
  search.addDocuments(books);
  suite.add('immutabl3/lunr', () => {
    search.search('the');
    search.search('an');
    search.search('of');
  });
}());

suite.run();