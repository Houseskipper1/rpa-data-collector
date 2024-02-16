const { MongoClient, ObjectId } = require('mongodb');

const dbURL = 'mongodb://localhost:27017';
const dbName = 'rpaDataCollectorDB';


async function runSetup() {
  const client = new MongoClient(dbURL, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB.');
    const db = client.db(dbName);
    await db.createCollection('entreprises');
    await db.createCollection('sireneEntreprises');
    await db.createCollection('naf')

    const sireneEntr = db.collection('sireneEntreprises');
    await sireneEntr.createIndex({ siren: 1 });
    console.log('Setup complete.');
  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    await client.close();
  }
}

runSetup();