CREATE TABLE sprints (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 start_date text NOT NULL,
 end_date text NOT NULL
);

CREATE TABLE issues (
 id integer PRIMARY KEY AUTOINCREMENT,
 sprint_id integer NOT NULL,
 name text NOT NULL,
 status text NOT NULL,
 time_estimate integer NOT NULL,
 remaining_time integer NOT NULL,
 project_id integer
);

CREATE TABLE projects (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL
);