
import { MongoClient } from 'mongodb';

// Author name-to-ID migration mapping.
const authorMapping = {
  'Maya Rivera': 'a1',
  'James Clear': 'a2',
  'George Orwell': 'a3'
};

const migrateAuthors = async () => {
  const uri = process.env.MONGODB_URI;
  const databaseName =
    process.env.MONGODB_DB_NAME || 'cse341-books-db';

  if (!uri) {
    throw new Error('MONGODB_URI is not defined.');
  }

  // Dry-run is the default.
  // Use --apply to make actual database changes.
  const applyChanges = process.argv.includes('--apply');

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(databaseName);
    const books = db.collection('books');
    const authors = db.collection('authors');

    console.log(`Database: ${databaseName}`);
    console.log(
      `Mode: ${applyChanges ? 'APPLY CHANGES' : 'DRY RUN'}`
    );

    // Verify all expected authors before changing any books.
    for (const [name, id] of Object.entries(authorMapping)) {
      const author = await authors.findOne({ id });

      if (!author || author.name !== name) {
        throw new Error(
          `Author verification failed: expected ${name} with ID ${id}. No books were migrated.`
        );
      }
    }

    console.log('\nAll three authors verified.');

    const allBooks = await books.find({}).toArray();

    let ready = 0;
    let alreadyMigrated = 0;
    let skipped = 0;
    let updated = 0;

    console.log('\nMigration review:');

    for (const book of allBooks) {
      const mappedAuthorId = authorMapping[book.author];

      // Already migrated documents are left untouched.
      if (book.authorId) {
        if (
          mappedAuthorId &&
          book.authorId === mappedAuthorId
        ) {
          alreadyMigrated++;
          console.log(
            `SKIP: ${book.id} already references ${book.authorId}.`
          );
        } else {
          skipped++;
          console.log(
            `SKIP: ${book.id} has an existing or conflicting authorId.`
          );
        }

        continue;
      }

      // Do not guess when an author name is unknown.
      if (!mappedAuthorId) {
        skipped++;
        console.log(
          `SKIP: ${book.id} has an unknown author: ${book.author}`
        );
        continue;
      }

      ready++;

      console.log(
        `READY: ${book.id}: "${book.author}" -> "${mappedAuthorId}"`
      );

      if (!applyChanges) {
        continue;
      }

      // Update the existing document in place.
      // MongoDB _id and all unrelated fields remain unchanged.
      const result = await books.updateOne(
        {
          _id: book._id,
          author: book.author,
          authorId: { $exists: false }
        },
        {
          $set: { authorId: mappedAuthorId },
          $unset: { author: '' }
        }
      );

      if (result.modifiedCount === 1) {
        updated++;
        console.log(`UPDATED: ${book.id}`);
      } else {
        skipped++;
        console.log(
          `SKIPPED: ${book.id} changed before the update could be applied.`
        );
      }
    }

    console.log('\nMigration summary:');
    console.log(`Books reviewed: ${allBooks.length}`);
    console.log(`Ready for migration: ${ready}`);
    console.log(`Already migrated: ${alreadyMigrated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Successfully updated: ${updated}`);

    if (!applyChanges) {
      console.log(
        '\nDRY RUN COMPLETE. No database documents were changed.'
      );
      console.log(
        'Review the results before running with --apply.'
      );
    } else {
      console.log('\nMIGRATION COMPLETED.');
    }
  } finally {
    await client.close();
  }
};

const runMigration = async () => {
  try {
    await migrateAuthors();
  } catch (error) {
    console.error('\nMigration failed:', error.message);
    process.exitCode = 1;
  }
};

await runMigration();
