<script lang="ts">
  import Card from '$components/Card.svelte';
  import { MailCheck } from 'lucide-svelte';
  import { page } from '$app/stores';

  $: email = $page.url.searchParams.get('email') || '';
</script>

<div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      <div class="text-center py-8">
        <MailCheck class="mx-auto text-primary-400 mb-4" size={48} />
        <h2 class="text-2xl font-bold text-white mb-2">Check Your Email</h2>
        <p class="text-dark-300 mb-4">
          We've sent a verification link to:
        </p>
        <p class="text-primary-400 font-semibold mb-6 break-all">{email}</p>
        
        <div class="space-y-3 text-left bg-dark-700/50 p-4 rounded-lg mb-6">
          <p class="text-dark-200 text-sm">
            <strong>💡 Tip:</strong> The link expires in 24 hours. If you don't see the email:
          </p>
          <ul class="text-dark-300 text-sm space-y-2 ml-4">
            <li>• Check your spam or junk folder</li>
            <li>• Wait a few minutes for it to arrive</li>
            <li>• Make sure you entered the correct email</li>
          </ul>
        </div>

        <div class="space-y-2">
          <a href="/auth/resend-verification?email={email}" class="btn-primary block w-full text-center">
            Resend Verification Email
          </a>
          <a href="/auth/login" class="btn-secondary block w-full text-center">
            Back to Login
          </a>
        </div>
      </div>
    </Card>
  </div>
</div>
