exports.up = async (sql) => {
  await sql`
	CREATE TABLE connections (
		id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
		user_id integer REFERENCES users (id) ON DELETE CASCADE,
	connected_user_id integer REFERENCES users (id) ON DELETE CASCADE,
	current_status varchar(3),
		expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '14 days'

	)`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE connections
  `;
};
