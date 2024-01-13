import { shallowMount } from "@vue/test-utils";
import WelcomePage from "@/views/WelcomePage.vue";
import { describe, beforeEach, test, expect} from 'vitest';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('WelcomePage', () => {
    let wrapper;

    beforeEach(() => {
        // Reset any existing mock handlers
        mock.reset();

        // Define a mock handler for a GET request to /apiTrip/trips
        mock.onGet('http://localhost:8080/apiTrip/trips').reply(200, {
            data: 'mocked trips data'
        });

        // Define a mock handler for a POST request to /apiTrip/tripsName/{tripId}
        mock.onPost(/http:\/\/localhost:8080\/apiTrip\/tripsName\/\d+/).reply(200, {
            data: 'mocked updated trip name data'
        });

        // Define a mock handler for a DELETE request to /apiTrip/trips/{tripId}
        mock.onDelete(/http:\/\/localhost:8080\/apiTrip\/trips\/\d+/).reply(200, {
            data: 'mocked delete trip data'
        });

        // Define a mock handler for a POST request to /apiTrip/trips
        mock.onPost('http://localhost:8080/apiTrip/trips').reply(200, {
            data: 'mocked new trip data'
        });

        wrapper = shallowMount(WelcomePage);
    });

    test('renders correctly', async () => {
        // Check if the component has been rendered
        expect(wrapper.exists()).toBeTruthy();

        // Check if the header is present
        expect(wrapper.find('.header').exists()).toBeTruthy();

        // Check if the form is present
        expect(wrapper.find('.create-trip-form').exists()).toBeTruthy();
    });
    test('form input updates on user input', async () => {
        // Simulate typing into the form input
        await wrapper.find('.trip-name input').setValue('New Trip');

        // Check if the form input value has been updated
        expect(wrapper.vm.tripName).toBe('New Trip');
    });
    // test('form submission updates the trip list', async () => {
    //     // Set the tripName data property
    //     await wrapper.setProps({ tripName: 'Test Trip' });
    //
    //     // Trigger the form submission
    //     await wrapper.find('.create-trip-form').trigger('submit.prevent');
    //
    //     // Check if the trip list has been updated
    //     expect(wrapper.vm.trips.length).equals(0);
    // });
});
