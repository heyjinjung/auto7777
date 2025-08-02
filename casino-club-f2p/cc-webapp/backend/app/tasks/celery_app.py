from celery import Celery

# Initialize Celery
celery_app = Celery(
    'tasks',
    broker='redis://redis:6379/0',  # Redis as the message broker
    backend='redis://redis:6379/0'   # Redis as the result backend
)

# Load task modules from all registered Django app configs.
celery_app.autodiscover_tasks()