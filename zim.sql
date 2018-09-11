CREATE TABLE sprints (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 start_date text NOT NULL,
 end_date text NOT NULL, 
 notes text default '', 
 quote text default ''
);

CREATE TABLE status (
 id integer PRIMARY KEY AUTOINCREMENT,
 type text NOT NULL
);

CREATE TABLE recent_issues (
  id integer PRIMARY KEY AUTOINCREMENT,
  issue_id integer NOT NULL,
  name text NOT NULL
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
 time_spent integer NOT NULL DEFAULT 0, 
 notes TEXT default "", 
 bad integer NOT NULL DEFAULT 0, 
 show_notes integer NOT NULL DEFAULT 0,
 FOREIGN KEY (sprint_id) REFERENCES sprints(id)
 FOREIGN KEY (project_id) REFERENCES projects(id)
 FOREIGN KEY (status) REFERENCES status(id)
);


CREATE TABLE timelog (
 id integer PRIMARY KEY AUTOINCREMENT,
 issue_id integer NOT NULL,
 sprint_id integer NOT NULL,
 time_delta integer NOT NULL DEFAULT 0,
 time_stat text NOT NULL,
 created_at text NOT NULL,
 total integer not null default 0
);

CREATE TABLE projects (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL
);

CREATE TABLE todos (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 done integer DEFAULT 0
);

CREATE TABLE scratchpads (
 id integer PRIMARY KEY AUTOINCREMENT,
 content text NOT NULL, 
 title TEXT default "", 
 archived default 0, 
 page integer NOT NULL
);

CREATE TABLE scratchpad_pages (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 archived default 0
);

INSERT INTO scratchpad_pages values(NULL, "Home", 0);

CREATE TABLE events (
 id integer NOT NULL,
 title text NOT NULL,
 start text NOT NULL,
 allDay integer NOT NULL default 0,
 end text
);
