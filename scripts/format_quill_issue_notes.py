import os
import datetime
import re
import dateutil.parser
from pprint import pprint
from collections import defaultdict

import sqlite3

DATABASE_PATH = '/Users/zaibowang/code/Issue-Manager/db/zim.db'


class SQL():
    """SQLite interface for database"""

    def __init__(self):
        self.conn = sqlite3.connect(DATABASE_PATH)
        self.cursor = self.conn.cursor()

    def select(self, query):
        self.cursor.execute(query)
        self.conn.commit()
        return self.cursor.fetchall()

    def update(self, query, args):
        self.cursor.execute(query, args)
        self.conn.commit()


# Convert this:
# g = GCD(a,b) iff g = GCD(b,r), where a = qb + r \n\nDefinition of GCD: g divides a and b \nfor any common division d, d | g \nax+by = c solvable if c is multiple of GCD \n\nGCD(a,b)*LCM(a,b) = ab
# Into this:
# <p>g = GCD(a,b) iff g = GCD(b,r), where a = qb + r </p><p><br></p><p>Definition of GCD: </p><p>g divides a and b </p><p>for any common division d, d | g </p><p><br></p><p>ax+by = c solvable if c is multiple of GCD </p><p>GCD(a,b)*LCM(a,b) = ab </p><p><br></p><p>1.14?</p>
# with these substitutions:
# \n\n => <p><br /></p>
# \n => surround with <p> </p>
def edit_note(note):
    groups = note.split('\n\n')
    new_groups = []
    for group in groups:
        lines = group.split('\n')
        lines = ["<p>" + line + "</p>" for line in lines]
        new_groups.append("".join(lines))

    return "<p><br /></p>".join(new_groups)


def quill_format_issue_notes():
    sql = SQL()
    log_data = sql.select("SELECT id, notes FROM issues")
    for row in log_data:
        note_id, note = row
        new_note = edit_note(note)
        sql.update("UPDATE issues SET notes=(?) WHERE id=(?)",
                   (new_note, note_id))


quill_format_issue_notes()
