import { router } from '@inertiajs/react';

// Utility function to convert Base64-URL to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeToPushNotifications(vapidPublicKey) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return; // Push not supported
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
            // Request permission & subscribe
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            // Send subscription to our backend
            router.post('/push/subscribe', subscription.toJSON(), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => console.log('Subscribed to native push notifications')
            });
        }
    } catch (error) {
        console.error('Failed to subscribe to push notifications', error);
    }
}
