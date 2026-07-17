const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'cpas_user',
      password: 'cpas_password',
      database: 'cpas_db',
      port: 3306
    });

    const username = 'mju364';
    const password = 'MJU@22567';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE username = ?`, [username]
    );

    if (rows.length === 0) {
      await connection.execute(
        `INSERT INTO users (id, username, passwordHash, role, fullName) 
         VALUES (UUID(), ?, ?, 'student', 'Test Student MJU')`,
        [username, passwordHash]
      );
      console.log('User seeded successfully! Username: mju364, Password: MJU@22567');
    } else {
      console.log('User already exists!');
    }

    await connection.end();
  } catch (error) {
    console.error('Error seeding user:', error);
  }
}

seed();
