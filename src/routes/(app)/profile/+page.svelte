<script lang="ts">
  import { authStore } from '$stores/auth';
  import Card from '$components/Card.svelte';
  import TextInput from '$components/TextInput.svelte';
  import { toastStore } from '$stores/toast';
  import { updateProfileSchema } from '$lib/validation';

  let displayName = $authStore.user?.displayName || '';
  let age = $authStore.user?.age || '';
  let bodyWeight = $authStore.user?.bodyWeight || 70;
  let isLoading = false;
  let errors: Record<string, string> = {};

  async function handleUpdateProfile() {
    errors = {};
    isLoading = true;

    try {
      const result = updateProfileSchema.safeParse({
        displayName,
        age: age ? parseInt(age) : undefined,
        bodyWeight
      });

      if (!result.success) {
        result.error.errors.forEach((err) => {
          const path = err.path[0] as string;
          errors[path] = err.message;
        });
        isLoading = false;
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        authStore.setUser(updatedUser);
        toastStore.success('Profile updated successfully!');
      } else {
        toastStore.error('Failed to update profile');
      }
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-4xl font-bold text-white mb-2">My Profile</h1>
    <p class="text-dark-300">Manage your account information and preferences</p>
  </div>

  <!-- Profile Section -->
  <Card class="mb-8">
    <h2 class="text-2xl font-bold text-white mb-6">Profile Information</h2>

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Profile Image -->
      <div>
        <img
          src={$authStore.user?.profileImage}
          alt={$authStore.user?.displayName}
          class="w-32 h-32 rounded-lg border-2 border-primary-500"
        />
      </div>

      <!-- Profile Form -->
      <div class="flex-1">
        <form on:submit|preventDefault={handleUpdateProfile} class="space-y-4">
          <TextInput
            label="Email Address"
            type="email"
            value={$authStore.user?.email || ''}
            disabled
            hint="Email cannot be changed"
          />

          <TextInput
            label="Username"
            type="text"
            value={$authStore.user?.username || ''}
            disabled
            hint="Username cannot be changed"
          />

          <TextInput
            label="Display Name"
            type="text"
            bind:value={displayName}
            error={errors.displayName}
            disabled={isLoading}
          />

          <div class="grid grid-cols-2 gap-4">
            <TextInput
              label="Age"
              type="number"
              bind:value={age}
              error={errors.age}
              disabled={isLoading}
            />
            <TextInput
              label="Body Weight (kg)"
              type="number"
              bind:value={bodyWeight}
              error={errors.bodyWeight}
              disabled={isLoading}
              hint="Used for caffeine calculations"
            />
          </div>

          <button
            type="submit"
            class="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  </Card>

  <!-- Account Stats -->
  <Card>
    <h2 class="text-2xl font-bold text-white mb-6">Account Details</h2>
    <div class="space-y-4 text-dark-300">
      <div class="flex justify-between">
        <span>Member Since:</span>
        <span class="text-primary-400 font-semibold">
          {new Date($authStore.user?.createdAt || '').toLocaleDateString()}
        </span>
      </div>
      <div class="flex justify-between">
        <span>Email Verified:</span>
        <span class="text-green-400 font-semibold">
          {$authStore.user?.emailVerified ? '✓ Yes' : '✗ No'}
        </span>
      </div>
      <div class="flex justify-between">
        <span>Account Role:</span>
        <span class="text-primary-400 font-semibold capitalize">
          {$authStore.user?.role || 'user'}
        </span>
      </div>
    </div>
  </Card>
</div>
