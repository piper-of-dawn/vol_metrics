import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import datetime
from firebase_admin import firestore
def initialize_firebase():
    """
    Initialize Firebase connection with credentials
    Replace 'path/to/serviceAccountKey.json' with your actual service account key path
    Replace 'your-database-url' with your Firebase database URL
    """
    cred = credentials.Certificate('key.json')
    print()
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://vol-metrics.firebaseio.com'
    })



from faker import Faker
def main():
    # Initialize Firebase
    initialize_firebase()
    fake = Faker()
    # Generate a list of fake data
    fake_data_list = []
    for i in range(10):  # Change the range for more or fewer entries
        sample_data = {
            'id': str(i + 1),  # Unique ID as a string
            'title': fake.name(),  # Random name
            'createdAt': fake.date_time().timestamp(),  # Timestamp for createdAt
            'description': fake.email(),  # Random email
        }
        fake_data_list.append(sample_data)
    print(fake_data_list)

# Example of how to use the generated data
    db = firestore.client()
    for sample_data in fake_data_list:
        db.collection("test").add(sample_data)
    print("Data successfully written")
    # Post to 'users' path in database
    # post_to_firebase(sample_data, '/test')

if __name__ == "__main__":
    main()