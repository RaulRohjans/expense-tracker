<script setup lang="ts">
    import { z } from 'zod'
    import type { FormSubmitEvent } from '#ui/types'
    import type { NuxtError } from '#app'

    export type ModalCategoryProps = {
        /**
         * Id of the category
         */
        id?: number | null

        /**
         * Name of the category
         */
        name?: string | null

        /**
         * Icon of the category
         */
        icon?: string | null
    }

    const props = withDefaults(defineProps<ModalCategoryProps>(), {
        id: null,
        name: '',
        icon: ''
    })

    const emit = defineEmits<{
        (event: 'submit'): void
        (event: 'successful-submit'): void
    }>()

    const { token } = useAuth()
    const { t: $t } = useI18n()
    const model = defineModel<boolean>()
    const error: Ref<null | string> = ref(null)

    /*
     * The reason we need this abomination is to display a general
     * form error, since the fields are in the same row, showing
     * field specific stuff would deformat everything...
     */
    const schema = z
        .object({
            name: z.string().optional(),
            icon: z.string().optional()
        })
        .superRefine(({ name }) => {
            if (!name || name.length === 0)
                error.value = $t('Category name is required')
        })
    /* ------------------------------------------------ */

    type Schema = z.output<typeof schema>
    const state = reactive({
        id: props.id,
        name: props.name,
        icon: props.icon
    })

    const onCreateCategory = function (event: FormSubmitEvent<Schema>) {
        emit('submit')

        $fetch(`/api/categories/${operation.value}`, {
            method: 'POST',
            headers: buildRequestHeaders(token.value),
            body: event.data
        })
            .then((data) => {
                if (!data.success)
                    return Notifier.showAlert(
                        $t('An error occurred when creating your category.'),
                        'error'
                    )

                // Emit success
                emit('successful-submit')

                // Disaply success message
                Notifier.showAlert(
                    $t('Operation completed successfully!'),
                    'success'
                )

                // Close modal
                model.value = false
            })
            .catch((e: NuxtError) => (error.value = e.statusMessage || null))
    }

    const operation = computed(() => {
        if (!props.id) return 'insert'
        return 'edit'
    })

    const displayIcon = computed(() => {
        if (!state.icon) return ''

        return `i-heroicons-${state.icon}`
    })
</script>

<template>
    <UModal v-model="model" :ui="{ container: 'items-center' }">
        <UForm
            :schema="schema"
            :state="state"
            class="space-y-4 p-6"
            @submit="onCreateCategory">
            <UFormGroup :error="error">
                <div
                    class="flex flex-row justify-between items-center space-y-0 gap-8">
                    <UFormGroup :label="$t('Name')" name="name" class="w-full">
                        <UInput v-model="state.name" />
                    </UFormGroup>

                    <UFormGroup :label="$t('Icon')" name="icon" class="w-full">
                        <div class="flex flex-row gap-1">
                            <!-- This should be an icon picker, but NuxtJS doesn't have one yet -->
                            <UInput v-model="state.icon" class="hide-span">
                                <template #trailing>
                                    <UIcon
                                        class="h-full"
                                        :name="displayIcon"
                                        dynamic />
                                </template>
                            </UInput>
                            <ULink to="https://heroicons.com/" target="_blank">
                                <UButton
                                    icon="i-heroicons-arrow-top-right-on-square"
                                    color="primary"
                                    square
                                    variant="ghost" />
                            </ULink>
                        </div>
                    </UFormGroup>
                </div>
            </UFormGroup>

            <UButton type="submit"> {{ $t('Submit') }} </UButton>
        </UForm>
    </UModal>
</template>
