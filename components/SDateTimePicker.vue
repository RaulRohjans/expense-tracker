<script setup lang="ts">
    import VueDatePicker from '@vuepic/vue-datepicker'
    import type { ModelValue } from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    export interface SDateTimePickerProps {
        /*
         * Type (date, datetime, or time)
         */
        type?: 'date' | 'datetime' | 'time'

        /*
         * CSS Classes to use on the component
         */
        class?: string

        /*
         * If the input is disabled
         */
        disabled?: boolean

        /*
         * If the input doesn't allow editing the value
         */
        readonly?: boolean

        /*
         * When true, the user can choose a range of dates or times
         */
        range?: boolean
    }

    const props = withDefaults(defineProps<SDateTimePickerProps>(), {
        type: 'date',
        disabled: false,
        readonly: false,
        range: false,
        class: ''
    })

    const emit = defineEmits<{
        (event: 'clear'): void
    }>()

    const colorMode = useColorMode()
    const model = defineModel<ModelValue>()

    const isDark = computed(() => {
        return colorMode.value === 'dark'
    })

    const dateTimeFormat = computed(() => {
        switch (props.type) {
            case 'date':
                return 'dd/MM/yyyy'
            case 'datetime':
                return 'dd/MM/yyyy HH:mm'
            case 'time':
                return 'HH:mm'
            default:
                return ''
        }
    })

    const textFormat = computed(() => {
        switch (props.type) {
            case 'date':
                return ['dd/MM/yyyy', 'dd-MM-yyyy', 'ddMMyyyy']
            case 'datetime':
                return [
                    'dd/MM/yyyy HH:mm',
                    'dd-MM-yyyy HH:mm',
                    'ddMMyyyy HH:mm',
                    'dd/MM/yyyy HHmm',
                    'dd-MM-yyyy HHmm',
                    'ddMMyyyy HHmm'
                ]
            case 'time':
                return ['HH:mm', 'HHmm']
            default:
                return ''
        }
    })

    const textInputOptions = computed(() => {
        return {
            format: textFormat.value
        }
    })

    const hasTimePicker = computed(() => {
        return props.type !== 'date'
    })

    const isTimePicker = computed(() => {
        return props.type === 'time'
    })
</script>

<template>
    <!--
        We need this ClientOnly here due to hydration issues
        with the VueDatePicker dependency.
        The issues are almost all related to the light and dark theme
        settings (the component always renders with the light theme on
        the server)
    -->
    <ClientOnly>
        <VueDatePicker
            v-model="model"
            :class="props.class"
            :disabled="props.disabled"
            :readonly="props.readonly"
            :text-input="textInputOptions"
            :time-picker="isTimePicker"
            :format="dateTimeFormat"
            :enable-time-picker="hasTimePicker"
            :dark="isDark"
            :range="props.range"
            clearable
            auto-apply
            @cleared="() => emit('clear')" />
    </ClientOnly>
</template>

<style scoped lang="scss">
    .dp__theme_dark {
        --dp-background-color: rgb(
            var(--color-gray-900) / var(--tw-bg-opacity)
        );
        --dp-text-color: #fff;
        --dp-hover-color: rgb(var(--color-gray-900) / var(--tw-bg-opacity));
        --dp-hover-text-color: #fff;
        --dp-hover-icon-color: #959595;
        --dp-primary-color: rgb(var(--color-primary-500));
        --dp-primary-disabled-color: #61a8ea;
        --dp-primary-text-color: #fff;
        --dp-secondary-color: #a9a9a9;
        --dp-border-color: rgb(var(--color-gray-700));
        --dp-menu-border-color: rgb(var(--color-gray-700));
        --dp-border-color-hover: rgb(var(--color-gray-700));
        --dp-border-color-focus: rgb(var(--color-primary-500));
        --dp-disabled-color: #737373;
        --dp-disabled-color-text: #d0d0d0;
        --dp-scroll-bar-background: #212121;
        --dp-scroll-bar-color: #484848;
        --dp-success-color: #00701a;
        --dp-success-color-disabled: #428f59;
        --dp-icon-color: #959595;
        --dp-danger-color: #e53935;
        --dp-marker-color: #e53935;
        --dp-tooltip-color: #3e3e3e;
        --dp-highlight-color: rgb(0 92 178 / 20%);
        --dp-range-between-dates-background-color: var(
            --dp-hover-color,
            #484848
        );
        --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
        --dp-range-between-border-color: var(--dp-hover-color, #fff);
    }

    .dp__theme_light {
        --dp-background-color: #fff;
        --dp-text-color: #212121;
        --dp-hover-color: #fff;
        --dp-hover-text-color: #212121;
        --dp-hover-icon-color: #959595;
        --dp-primary-color: rgb(var(--color-primary-500));
        --dp-primary-disabled-color: rgb(var(--color-primary-400));
        --dp-primary-text-color: #f8f5f5;
        --dp-secondary-color: #c0c4cc;
        --dp-border-color: rgb(var(--color-gray-300));
        --dp-menu-border-color: rgb(var(--color-gray-300));
        --dp-border-color-hover: rgb(var(--color-gray-300));
        --dp-border-color-focus: rgb(var(--color-primary-500));
        --dp-disabled-color: #f6f6f6;
        --dp-scroll-bar-background: #f3f3f3;
        --dp-scroll-bar-color: #959595;
        --dp-success-color: #76d275;
        --dp-success-color-disabled: #a3d9b1;
        --dp-icon-color: #959595;
        --dp-danger-color: #ff6f60;
        --dp-marker-color: #ff6f60;
        --dp-tooltip-color: #fafafa;
        --dp-disabled-color-text: #8e8e8e;
        --dp-highlight-color: rgb(25 118 210 / 10%);
        --dp-range-between-dates-background-color: var(
            --dp-hover-color,
            #f3f3f3
        );
        --dp-range-between-dates-text-color: var(
            --dp-hover-text-color,
            #212121
        );
        --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
    }

    .dp__main {
        /*General*/
        --dp-font-family: ui-sans-serif, system-ui, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'Noto Color Emoji';
        --dp-border-radius: 0.375rem; /*Configurable border-radius*/
        --dp-cell-border-radius: 4px; /*Specific border radius for the calendar cell*/
        --dp-common-transition: all 0.1s ease-in; /*Generic transition applied on buttons and calendar cells*/

        /*Sizing*/
        --dp-button-height: 35px; /*Size for buttons in overlays*/
        --dp-month-year-row-height: 35px; /*Height of the month-year select row*/
        --dp-month-year-row-button-size: 35px; /*Specific height for the next/previous buttons*/
        --dp-button-icon-height: 20px; /*Icon sizing in buttons*/
        --dp-cell-size: 35px; /*Width and height of calendar cell*/
        --dp-cell-padding: 5px; /*Padding in the cell*/
        --dp-common-padding: 10px; /*Common padding used*/
        --dp-input-icon-padding: 35px; /*Padding on the left side of the input if icon is present*/
        --dp-input-padding: 6px 30px 6px 12px; /*Padding in the input*/
        --dp-menu-min-width: 260px; /*Adjust the min width of the menu*/
        --dp-action-buttons-padding: 2px 5px; /*Adjust padding for the action buttons in action row*/
        --dp-row-margin: 5px 0; /*Adjust the spacing between rows in the calendar*/
        --dp-calendar-header-cell-padding: 0.5rem; /*Adjust padding in calendar header cells*/
        --dp-two-calendars-spacing: 10px; /*Space between multiple calendars*/
        --dp-overlay-col-padding: 3px; /*Padding in the overlay column*/
        --dp-time-inc-dec-button-size: 32px; /*Sizing for arrow buttons in the time picker*/
        --dp-menu-padding: 6px 8px; /*Menu padding*/

        /*Font sizes*/
        --dp-font-size: 0.875rem; /*Default font-size*/
        --dp-preview-font-size: 0.8rem; /*Font size of the date preview in the action row*/
        --dp-time-font-size: 0.875rem; /*Font size in the time picker*/

        /*Transitions*/
        --dp-animation-duration: 0.1s; /*Transition duration*/
        --dp-menu-appear-transition-timing: cubic-bezier(
            0.4,
            0,
            1,
            1
        ); /*Timing on menu appear animation*/
        --dp-transition-timing: ease-out; /*Timing on slide animations*/
    }
</style>
