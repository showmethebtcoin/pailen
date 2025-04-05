
import { createClient } from 'redis';

type QueueTask = {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: number;
};

// Intentar conectar con Redis si está disponible, de lo contrario usar caché en memoria
let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisAvailable = false;

// En memoria para fallback
const taskQueue: QueueTask[] = [];
const cache = new Map<string, { data: any; expiry: number }>();

// Inicializar conexión Redis
const initRedis = async () => {
  try {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    const client = createClient({ url });
    
    await client.connect();
    redisClient = client;
    isRedisAvailable = true;
    console.log('Conectado a Redis correctamente');
    
    return client;
  } catch (error) {
    console.warn('No se pudo conectar a Redis, usando caché en memoria:', error);
    isRedisAvailable = false;
    return null;
  }
};

// Queue functions
export const enqueueTask = async (type: string, data: Record<string, any>): Promise<string> => {
  const taskId = `task_${Math.random().toString(36).substr(2, 9)}`;
  
  const task: QueueTask = {
    id: taskId,
    type,
    data,
    timestamp: Date.now()
  };
  
  if (isRedisAvailable && redisClient) {
    try {
      await redisClient.lPush('taskQueue', JSON.stringify(task));
      console.log(`Task enqueued in Redis: ${type}`, task);
    } catch (error) {
      console.error('Error al encolar tarea en Redis, usando memoria:', error);
      taskQueue.push(task);
    }
  } else {
    taskQueue.push(task);
    console.log(`Task enqueued in memory: ${type}`, task);
  }
  
  return taskId;
};

export const processQueue = async (): Promise<void> => {
  let task: QueueTask | null = null;
  
  if (isRedisAvailable && redisClient) {
    try {
      const taskJson = await redisClient.rPop('taskQueue');
      if (taskJson) {
        task = JSON.parse(taskJson);
      }
    } catch (error) {
      console.error('Error al procesar cola de Redis, usando memoria:', error);
      task = taskQueue.shift() || null;
    }
  } else {
    task = taskQueue.shift() || null;
  }
  
  if (!task) {
    return;
  }
  
  console.log(`Processing task: ${task.type}`, task);
  
  try {
    // Process different task types
    switch (task.type) {
      case 'generate_test':
        // This would call the test generation function
        console.log(`Generating test for student ${task.data.studentId}`);
        break;
      case 'send_email':
        // This would call the email sending function
        console.log(`Sending email to ${task.data.email}`);
        break;
      default:
        console.log(`Unknown task type: ${task.type}`);
    }
  } catch (error) {
    console.error(`Error processing task ${task.id}:`, error);
    // In a real implementation, this might requeue the task or move it to a dead letter queue
  }
};

// Cache functions
export const setCache = async (key: string, data: any, ttlSeconds: number = 3600): Promise<void> => {
  if (isRedisAvailable && redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
      console.log(`Cached data in Redis for key: ${key}`);
      return;
    } catch (error) {
      console.error('Error al guardar en caché Redis, usando memoria:', error);
    }
  }
  
  // Fallback to in-memory cache
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000
  });
  
  console.log(`Cached data in memory for key: ${key}`);
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  if (isRedisAvailable && redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        console.log(`Cache hit in Redis for key: ${key}`);
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      console.error('Error al leer caché Redis, usando memoria:', error);
    }
  }
  
  // Fallback to in-memory cache
  const cached = cache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // Check if the cached data has expired
  if (cached.expiry < Date.now()) {
    cache.delete(key);
    return null;
  }
  
  console.log(`Cache hit in memory for key: ${key}`);
  return cached.data as T;
};

// Initialize periodic queue processing
// In a real implementation, this would be a separate worker process
let queueProcessor: NodeJS.Timeout | null = null;

export const startQueueProcessor = (): void => {
  // Inicializar Redis
  initRedis();
  
  if (queueProcessor) {
    return;
  }
  
  queueProcessor = setInterval(() => {
    processQueue().catch(err => console.error('Error en procesamiento de cola:', err));
  }, 5000);
  
  console.log('Queue processor started');
};

export const stopQueueProcessor = (): void => {
  if (queueProcessor) {
    clearInterval(queueProcessor);
    queueProcessor = null;
    console.log('Queue processor stopped');
  }
  
  // Cerrar conexión Redis
  if (redisClient) {
    redisClient.disconnect().catch(console.error);
    redisClient = null;
    isRedisAvailable = false;
  }
};

// No iniciamos automáticamente para evitar comportamiento no esperado
// La inicialización se hace desde el punto de entrada de la aplicación
