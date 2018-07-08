CREATE TABLE sprints (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 start_date text NOT NULL,
 end_date text NOT NULL
);

CREATE TABLE status (
 id integer PRIMARY KEY AUTOINCREMENT,
 type text NOT NULL
);

INSERT INTO status values(null, "In queue");
INSERT INTO status values(null, "In progress");
INSERT INTO status values(null, "Paused");
INSERT INTO status values(null, "Done");

CREATE TABLE issues (
 id integer PRIMARY KEY AUTOINCREMENT,
 sprint_id integer NOT NULL,
 name text NOT NULL,
 status text NOT NULL,
 time_estimate integer NOT NULL,
 time_remaining integer NOT NULL,
 project_id integer,
 blocked integer DEFAULT 0,
 FOREIGN KEY (sprint_id) REFERENCES sprints(id)
 FOREIGN KEY (project_id) REFERENCES projects(id)
 FOREIGN KEY (status) REFERENCES status(id)
);

CREATE TABLE projects (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL
);
