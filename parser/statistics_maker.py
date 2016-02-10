import json
import glob
import os.path
import database


def build_task_database(files, entry_class):
    task_db = database.Database(entry_class)
    for filename in files:
        with open(filename, encoding='utf-8') as file:
            data = json.load(file)
        for task in data:
            task_db.add_entry(task)
    if 'finalize' in dir(task_db):
        task_db.finalize()
    return task_db


def jdefault(o):
    if isinstance(o, set):
        return list(o)
    return o.__dict__


def write_json(db, filename):
    dumped = json.dumps(db, ensure_ascii=False, indent=4,
                        sort_keys=True, default=jdefault)
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(dumped)


def update_files():
    files = glob.glob(os.path.join('../courses', '*.json'))

    small_db = build_task_database(files, database.EntryWithPercentage)
    write_json(small_db, '../database/tasks_base.json')

    big_db = build_task_database(files, database.EntryAnnualFullInfo)
    write_json(big_db, '../database/tasks_full.json')

    cat_db = build_task_database(files, database.EntryAnnualShortInfo)
    write_json(cat_db, '../database/categories.json')


if __name__ == '__main__':
    update_files()
