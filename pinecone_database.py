# pinecone_database.py

import pinecone
import numpy as np
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Pinecone client
pinecone.init(api_key=os.getenv('PINECONE_API_KEY'), environment='us-east-1')

# Connect to your Pinecone index
index_name = 'my-index'  # Replace with your index name
index = pinecone.Index(index_name)

def generate_random_vector(dimensions):
    return np.random.rand(dimensions).tolist()

def create_records(num_records, dimensions):
    records = []
    for i in range(num_records):
        vector = generate_random_vector(dimensions)
        metadata = {'record_id': str(i), 'info': f'Sample metadata for record {i}', 'genre': 'action' if i % 2 == 0 else 'drama'}
        records.append({'id': str(i), 'values': vector, 'metadata': metadata})
    return records

def upsert_records(records):
    try:
        response = index.upsert(
            vectors=records,
            namespace="ns1"  # Use namespace to segregate data
        )
        print(f"Upsert response: {response}")
    except Exception as e:
        print(f"Error upserting records: {e}")

def query_index(query_vector, top_k=2):
    try:
        response = index.query(
            namespace="ns1",
            vector=query_vector,
            top_k=top_k,
            include_values=True,
            include_metadata=True,
            filter={"genre": {"$eq": "action"}}
        )
        return response
    except Exception as e:
        print(f"Error querying index: {e}")
        return None

if __name__ == '__main__':
    num_records = 10
    dimensions = 1536
    records = create_records(num_records, dimensions)
    upsert_records(records)
    
    # Example query
    example_vector = generate_random_vector(dimensions)
    result = query_index(example_vector)
    print(f"Query result: {result}")
