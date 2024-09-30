export const googleanalytics = () => {
    const trackButtonClick = (labelString: string, categoryString: string, eventType: string) => {
        if (window.gtag) {
            window.gtag('event', `${eventType}`, {
                event_category: `${categoryString}`,
                event_label: `${labelString}`,
            });
        }
    };

    return {
        trackButtonClick
    };
}