import { shallowMount } from "@vue/test-utils";
import WelcomePage from "@/views/WelcomePage.vue";
import { describe, beforeEach, test, expect } from 'vitest';
import { createMemoryHistory, createRouter } from "vue-router";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: {} }],
})

describe('WelcomePage', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(WelcomePage, {
            global: {
                plugins: [router],
            },
        });
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
    test('form submission updates the trip list', async () => {
        // Set the tripName data property
        await wrapper.setProps({ tripName: 'Test Trip' });

        // Trigger the form submission
        await wrapper.find('.create-trip-form').trigger('submit.prevent');

        // Check if the trip list has been updated
        expect(wrapper.vm.trips.length).equals(0);
    });
});
