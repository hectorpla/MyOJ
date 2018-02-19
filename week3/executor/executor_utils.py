import docker
import os
import shutil
import uuid

from docker.errors import APIError
from docker.errors import ContainerError
from docker.errors import ImageNotFound

CURRENT_DIR = os.path.dirname(os.path.relpath(__file__))
IMAGE_NAME = 'hectorilles/cs503_1801'

docker_client = docker.from_env()

CONTAINER_NAME = "{}:latest".format(IMAGE_NAME)
TEMP_BUILD_DIR = "{}/tmp".format(CURRENT_DIR)

SOURCE_NAME = {
    'Java': 'Solution.java',
    'Python': 'example.py'
}

COMPILE_COMMAND = {
    'Java': 'javac',
    'Python': 'echo'
}

EXECUTE_COMMAND = {
    'Java': 'java',
    "Python": 'python3'
}

BINARY_NAME = {
    'Java': 'Solution',
    'Python': 'example.py'
}

def load_image():
    try:
        docker_client.images.get(IMAGE_NAME)
        print("Image exists locally")
    except ImageNotFound as e:
        print("Image not found")
    # except APIError:
    #     print("API error")


def make_dir(dir_name):
    try:
        os.mkdir(dir_name)
    except OSError:
        print("failed to make dir")


def build_and_run(code, lang):
    result = {'build': None, 'run': None, 'error': None}
    src_dir = uuid.uuid4()
    
    src_host_dir = "{}/{}".format(TEMP_BUILD_DIR, src_dir)
    src_guest_dir = '/test/{}'.format(src_dir)

    try:
        make_dir(src_host_dir)
        src_handler = open("{}/{}".format(src_host_dir, SOURCE_NAME[lang]), 'w')
        src_handler.write(code)
        src_handler.close()
    except:
        print('failed saving code to a file')
        shutil.rmtree(src_host_dir)
        result['error'] = 'writing'
        return result

    volumes = {
                src_host_dir: {
                'bind': src_guest_dir,
                'mode': 'rw'
                }
            }

    command = "{} {}".format(COMPILE_COMMAND[lang], SOURCE_NAME[lang])
    # Build
    try:
        print('running command: ' + command)
        docker_client.containers.run(image=IMAGE_NAME, command=command,
                                        volumes=volumes,
                                        working_dir=src_guest_dir)
        print("successfully built")
        result['build'] = 'OK'
    except ContainerError as ce: 
        result['build'] = str(ce.stderr, 'utf-8')
        shutil.rmtree(src_host_dir)
        return result

    command = "{} {}".format(EXECUTE_COMMAND[lang], BINARY_NAME[lang])
    # Run
    try:
        print('running command: ' + command)
        log = docker_client.containers.run(image=IMAGE_NAME, command=command,
                                            volumes=volumes,
                                            working_dir=src_guest_dir)
        result['run'] = str(log, 'utf-8')
        print('log: ', log)
    except ContainerError as ce:
        result['run'] = str(ce.stderr, 'utf-8')
    finally:
        shutil.rmtree(src_host_dir)
        return result

        