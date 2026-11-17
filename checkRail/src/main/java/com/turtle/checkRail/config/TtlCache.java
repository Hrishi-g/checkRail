package com.turtle.checkRail.config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TtlCache<K, V> {
    private final long ttlMillis;
    private final Map<K, CacheEntry<V>> store = new ConcurrentHashMap<>();

    public TtlCache(long ttlSeconds) {
        this.ttlMillis = ttlSeconds * 1000L;
    }

    private record CacheEntry<V>(V value, long expiryTime) {}

    public V get(K key) {
        CacheEntry<V> entry = store.get(key);
        if (entry == null) {
            return null;
        }
        if (System.currentTimeMillis() > entry.expiryTime()) {
            store.remove(key);
            return null;
        }
        return entry.value();
    }

    public void put(K key, V value) {
        store.put(key, new CacheEntry<>(value, System.currentTimeMillis() + ttlMillis));
    }

    public void clear() {
        store.clear();
    }
}
