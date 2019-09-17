import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: 'Nova inscrição para seu Meet',
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        title: meetup.title,
        registered: user.name,
        email: user.email,
      },
    });
  }
}

export default new SubscriptionMail();
