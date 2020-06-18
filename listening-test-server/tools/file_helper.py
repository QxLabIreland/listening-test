import hashlib
import os


static_root_url = '/static'


# Write a file in UUID name
def write_in_md5(file, folder):
    path = os.path.join(os.getcwd(), "static", folder)
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


# Write files in designated folder
def write_upload_files(file_metas, folder):
    path = os.path.join(os.getcwd(), "static", folder)
    # Create nested dirs
    if not os.path.exists(path):
        os.makedirs(path)
    files_paths = []
    for meta in file_metas:
        # Build src for a file
        files_paths.append(f'{static_root_url}/{folder}/{meta["filename"]}')
        with open(os.path.join(path, meta["filename"]), 'wb') as up:
            up.write(meta['body'])
    return files_paths


# Get a list of files in designated folder
def list_files(folder):
    path = os.path.join(os.getcwd(), "static", folder)
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
    path = os.path.join(os.getcwd(), "static", folder, filename)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False
