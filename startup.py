import json
import requests

class AddUsers:
    def __init__(self, api_url):
        self.api_url = api_url

    def add_user(self):
        user = {
            "name": "Test User 1",
            "email": "testuser1@email.com",
            "password": "password"
        }

        try:
            response = requests.post(f"{self.api_url}/addUser", json=user)
            if response.status_code == 201:
                print("User added successfully.")
            else:
                print(f"Failed to add user: {response.status_code} - {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")

    def add_employer(self):
        employer = {
            "name": "Test Employer 1",
            "email": "testemployer1@email.com",
            "password": "password"
        }

        try:
            response = requests.post(f"{self.api_url}/addEmployer", json=employer)
            if response.status_code == 201:
                print("Employer added successfully.")
            else:
                print(f"Failed to add employer: {response.status_code} - {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")

    def add_admin(self):
        admin = {
            "name": "Test Admin 1",
            "email": "testadmin1@email.com",
            "password": "password"
        }

        try:
            response = requests.post(f"{self.api_url}/addAdmin", json=admin)
            if response.status_code == 201:
                print("Admin added successfully.")
            else:
                print(f"Failed to add admin: {response.status_code} - {response.text}") 

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")

class AddJobs:
    def __init__(self, api_url, token):
        self.api_url = api_url
        self.token = token  

    def add_jobs(self):
        with open('jobs.json', 'r') as file:
            jobs = json.load(file) 

        headers = {
            "Authorization": f"Bearer {self.token}",
        }

        for job in jobs:
            try:
                response = requests.post(f"{self.api_url}/addJob", json=job, headers=headers)
                if response.status_code == 201:
                    print(f"Job '{job['title']}' added successfully.")
                else:
                    print(f"Failed to add job '{job['title']}': {response.status_code} - {response.text}")

            except requests.exceptions.RequestException as e:
                print(f"An error occurred while adding job '{job['title']}': {e}")

class Main:
    def menu(self):
        print("1. Add User")
        print("2. Add Employers")
        print("3. Add Admins")
        print("4. Add Jobs")
        print("5. Exit")
        choice = input("Enter your choice: ")
        return choice
    
    def main(self):
        api_url = "http://localhost:3000/api"

        while True:
            choice = self.menu()

            if choice == "1":
                add_users = AddUsers(api_url)
                add_users.add_user()

            elif choice == "2":
                add_users = AddUsers(api_url)
                add_users.add_employer()

            elif choice == "3":
                add_users = AddUsers(api_url)
                add_users.add_admin()

            elif choice == "4":
                token = input("Enter your API token: ")
                add_jobs = AddJobs(api_url, token)
                add_jobs.add_jobs()

            elif choice == "5":
                print("Exiting...")
                break

            else:
                print("Invalid choice. Please try again.")

        
main = Main()
main.main()

