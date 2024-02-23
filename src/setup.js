import { readFile } from 'fs/promises';
import { createSchema, dropSchema, query, end } from './lib/db.js';

async function main() {
  const drop = await dropSchema();

  if(drop){
    console.info('schema dropped');
  } else {
    console.info('error dropping schema, exiting');
    process.exit(-1);
  }


  const result = await createSchema();

  if(result){
    console.info('schema created');
  } else {
    console.info('schema not created');
  }

  const data = await readFile('./sql/insert.sql')
  const insert = await query(data.toString('utf-8'))

  if(insert){
    console.info('data inserted');
  } else {
    console.info('data not inserted')
  }

  await end();

}

main().catch((err) => {
  console.error('Error running setup', err);
});
