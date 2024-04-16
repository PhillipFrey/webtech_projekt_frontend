import { shallowMount } from "@vue/test-utils";
import WelcomePage from "@/views/WelcomePage.vue";
import { describe, beforeEach, test, expect} from 'vitest';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('WelcomePage', () => {
    let wrapper;
    const base_url_backend = import.meta.env.VITE_BACKEND_URL;

    beforeEach(() => {
        mock.reset();

        mock.onGet(base_url_backend + '/apiTrip/trips').reply(200, {
            data: 'mocked trips data'
        });

        mock.onPost(base_url_backend + '/apiTrip/tripsName').reply(200, {
            data: 'mocked updated trip name data'
        });

        mock.onDelete(base_url_backend + '/apiTrip/trips').reply(200, {
            data: 'mocked delete trip data'
        });

        mock.onPost(base_url_backend + '/apiTrip/trips').reply(200, {
            data: 'mocked new trip data'
        });

        wrapper = shallowMount(WelcomePage);
    });

    test('renders correctly', async () => {
        expect(wrapper.exists()).toBeTruthy();

        expect(wrapper.find('.header').exists()).toBeTruthy();

        expect(wrapper.find('.create-trip-form').exists()).toBeTruthy();
    });
    test('form input updates on user input', async () => {
        await wrapper.find('.trip-name input').setValue('New Trip');

        expect(wrapper.vm.tripName).toBe('New Trip');
    });
});
