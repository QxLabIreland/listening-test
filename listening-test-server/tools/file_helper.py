import hashlib
import os
import csv
from datetime import datetime
from typing import List

static_root_url = '/static2'


# Write a file in UUID name
def write_in_md5(file, folder: str):
    path = os.path.join(os.getcwd(), "static2", folder)
    # If the folder exists, create nested dirs
    if not os.path.exists(path):
        os.makedirs(path)
    # Get extension
    extension_file = os.path.splitext(file["filename"])[1]
    # Build new name in md5
    file_name = hashlib.md5(file["body"]).hexdigest() + extension_file
    # Write a file
    path = os.path.join(path, file_name)
    with open(path, 'wb') as up:
        up.write(file["body"])
    # Return the backend url path
    return f"{static_root_url}/{folder}/{file_name}"


# Write data in scv file
def write_data_in_csv(columns: List[str], data: List[dict], prefix_name: str = ''):
    path = os.path.join(os.getcwd(), "csv_files")
    # If the folder exists, create nested dirs
    if not os.path.exists(path):
        os.makedirs(path)
    # Build filename
    csv_file = prefix_name + datetime.now().strftime('%Y%m%d%H%M%S') + '.csv'
    filename = os.path.join(path, csv_file)
    # Open a file and write data into it.
    with open(filename, 'w', newline='') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=columns)
        writer.writeheader()
        # Start writing data
        writer.writerows(data)
    return filename


def get_path_size(start_path='.'):
    total_size = 0
    total_num = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # skip if it is symbolic link
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)
                total_num += 1

    return sizeof_fmt(total_size), total_num


def sizeof_fmt(num):
    for unit in ['', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB']:
        if abs(num) < 1024.0:
            return "%3.1f%s" % (num, unit)
        num /= 1024.0
    return "%.1f%s" % (num, 'YB')


# Get a list of files in designated folder
def list_files(folder):
    path = os.path.join(os.getcwd(), "static2", folder)
    result = []
    # If the folder exists
    if os.path.exists(path):
        dirs = os.listdir(path)
        for f in dirs:
            # Get the information of files, size in MB
            stat = os.stat(path + "/" + f)
            result.append({
                'filename': f,
                'size': "%.3f" % (stat.st_size / (1024 * 1024)),
                'change_time': stat.st_ctime,
                'url': os.path.join(static_root_url, folder, f)
            })
    return result


def delete_file(folder, filename):
    path = os.path.join(os.getcwd(), "static2", folder, filename)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False
