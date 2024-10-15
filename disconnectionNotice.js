import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError } from "lightning/empApi";

export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    status;
    identifier;
    channelName ="/event/Asset_Disconnection__e";

    connectedCallback() {
        this.handleSubscribe();
    }

    renderedCallback(){
        
    }

    handleSubscribe() {
    // Callback invoked whenever a new event message is received
    const messageCallback = (response) => {
        console.log('New message received: ', JSON.stringify(response));
        
        // Extract relevant data from the response
        const payload = response.data.payload;
        const assetId = payload.Asset_Identifier__c;
        const disconnected = payload.Disconnected__c;

        // Update the status based on the payload
        this.status = disconnected;

        // Perform actions based on the data
        if (disconnected) {
            this.showSuccessToast(assetId);
        } else {
            this.showErrorToast();
        }
    }
            // Invoke subscribe method of empApi. Pass reference to messageCallback
            subscribe(this.channelName, -1, messageCallback).then((response) => {
                // Response contains the subscription information on subscribe call
                console.log('Subscription request sent to:', JSON.stringify(response.channel));
                this.subscription = response;
            }).catch(error => {
                console.error('Subscription error: ', error);
                this.showErrorToast();
            });
}

    disconnectedCallback() {
        //Implement your unsubscribing solution here
    }

    showSuccessToast(assetId) {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Asset Id '+assetId+' is now disconnected',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Asset was not disconnected. Try Again.',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

}