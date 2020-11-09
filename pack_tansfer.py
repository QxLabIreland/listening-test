import os
import shutil
import tarfile
import subprocess


# subprocess.run('npm run build --prefix listening-test-react', shell=True)

try:
    print('Start cleaning build folder and archive file...')
    base_dir = 'listeningTest'
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    # Archive file
    base_dir_tgz = base_dir + '.tgz'
    if os.path.exists(base_dir_tgz):
        os.remove(base_dir_tgz)

    # # Move tornado server files
    # server_dir = os.path.join(base_dir, 'server')
    # for v in ['/handlers', '/tools', '/server.py', '/mongodbconnection.py', '/url.py']:
    #     source = 'listening-test-server' + v
    #     if os.path.isfile(source):
    #         shutil.copyfile(source, server_dir + v)
    #     else:
    #         shutil.copytree(source, server_dir + v, ignore=shutil.ignore_patterns('*.pyc', '__pycache__'))

    print('Move server files...')
    server_dir = os.path.join(base_dir, 'server')
    shutil.copytree('listening-test-server', server_dir, ignore=shutil.ignore_patterns('*.pyc', '__pycache__', '.idea', 'static2', 'venv', '.gitignore'))

    print('Move react files...')
    html_dir = os.path.join(base_dir, 'html')
    shutil.copytree("listening-test-react/build", html_dir)

    print('Move configuration files...')
    # shutil.copyfile("golisten.supervisor.conf", os.path.join(base_dir, "golisten.supervisor.conf"))
    # shutil.copyfile("golisten.nginx.conf", os.path.join(base_dir, "golisten.nginx.conf"))
    # Docker config files
    shutil.copyfile("Dockerfile.backend", os.path.join(base_dir, 'server', "Dockerfile"))
    shutil.copyfile("Dockerfile.frontend", os.path.join(base_dir, 'html', "Dockerfile"))
    shutil.copyfile("golisten.nginx80.conf", os.path.join(base_dir, 'html', "golisten.nginx80.conf"))
    shutil.copyfile("docker-compose.yml", os.path.join(base_dir, "docker-compose.yml"))

    print('Create tar file...')
    with tarfile.open(base_dir_tgz, "w:gz") as tar:
            tar.add(base_dir, arcname=os.path.basename(base_dir))

    # You may need to delete this
    print('Transfer the files to server...')
    subprocess.run(f'scp -i golisten_ssh_key.pem -r {base_dir}/* golistenadmin@golisten.ucd.ie:/home/golistenadmin/golisten/')

    print('Start ssh and run script...')
    # subprocess.run('ssh -i ForStudy.pem ubuntu@63.34.10.16 "pip install tornado pymongo"')
    # subprocess.run('ssh -i ForStudy.pem ubuntu@63.34.10.16 "sudo supervisorctl reload"')
    subprocess.run('ssh -i golisten_ssh_key.pem -t golistenadmin@golisten.ucd.ie "sudo supervisorctl restart golisten"')
    input('You can close the window now')

except Exception as ex:
    print(ex)
    input('Error occurred')
