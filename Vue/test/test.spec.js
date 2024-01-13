import { shallowMount } from "@vue/test-utils";
import WelcomePage from "../src/views/WelcomePage.vue";
import { describe, beforeEach, test, expect } from 'vitest';

describe('WelcomePage', () => {
    let wrapper;

    beforeEach(() => {
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

    test('submitting the form triggers the submitTrip method', async () => {
        // Mock the submitTrip method
        const submitTripMock = jest.fn();
        wrapper.setMethods({ submitTrip: submitTripMock });

        // Trigger the form submission
        await wrapper.find('form').trigger('submit');

        // Check if the submitTrip method has been called
        expect(submitTripMock).toHaveBeenCalled();
    });
});
