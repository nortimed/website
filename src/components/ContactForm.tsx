
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!name || !email || !message) {
            setError('All fields are required.');
            return;
        }

        // Here you would typically handle the form submission, e.g., sending data to an API
        console.log({ name, email, message });
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-lg mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Contact Us</h2>
                {error && <p className="text-red-600 text-center mb-2">{error}</p>}
                {success && <p className="text-green-600 text-center mb-2">Your message has been sent!</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full py-3 font-semibold">Send Message</Button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;