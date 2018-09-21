<template>
  <div v-if="message" style="width: 100%">
    <FromMeMessage v-if="message.author.uid===userUID" :time="message.sendingTime" style="padding-left: 0">
      <slot>
        <result-view v-if="isAlreadyVoted(message.value)" :poll="message.value"
                     :fontColor="'white'" :classes="['my']" @removeVote="onRemoveVote"></result-view>
        <vote-on-poll-form v-else :poll="message.value" :fontColor="'white'" :classes="['my']"
                           @optionSelected="onOptionSelected">
        </vote-on-poll-form>
      </slot>
    </FromMeMessage>
    <FromThemMessage v-else :time="message.sendingTime" :author="message.author" style="padding-right: 0">
      <slot>
        <result-view v-if="isAlreadyVoted(message.value)" :poll="message.value"
                     @removeVote="onRemoveVote"></result-view>
        <vote-on-poll-form v-else :poll="message.value" @optionSelected="onOptionSelected">
        </vote-on-poll-form>
      </slot>
    </FromThemMessage>
  </div>
</template>

<script>
  import Vue from 'vue'

  import FromMeMessage from '@/components/message-list/message/from-me-message.vue'
  import FromThemMessage from '@/components/message-list/message/from-them-message.vue'
  import VoteOnPollForm from '@/components/poll/vote-on-pole-form.vue'
  import ResultView from '@/components/poll/result-view.vue'

  export default {
    props: {
      message: {
        type: Object,
        default: null
      },
      userUID: {
        type: String,
        default: null
      }
    },

    methods: {
      onOptionSelected(selectedOption) {
        const message = JSON.parse(JSON.stringify(this.message));
        const option = message.value.options[selectedOption];
        if (!option.voted)
          option.voted = [];
        option.voted.push(this.userUID);

        this.$emit('messageUpdated', message);
      },
      isAlreadyVoted(poll) {
        return [].concat.apply([], poll.options.map(o => o.voted).filter(v => v != null)).includes(this.userUID);
      },
      onRemoveVote() {
        const message = JSON.parse(JSON.stringify(this.message));
        message.value.options.forEach(o => {
          if (o.voted == null) return;
          o.voted = o.voted.filter(userUID => userUID !== this.userUID);
        });
        this.$emit('messageUpdated', message);
      }
    },

    components: {
      FromMeMessage, FromThemMessage, VoteOnPollForm, ResultView
    }

  }
</script>
