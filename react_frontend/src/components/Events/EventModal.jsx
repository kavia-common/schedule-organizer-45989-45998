import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';

// PUBLIC_INTERFACE
export function EventModal({ open, onClose, onSave, onDelete, initialEvent }) {
  /**
   * Modal for creating or editing events.
   * Fields: title (required), start, end, description, color.
   * Validates that end >= start and title is provided.
   */
  const [form, setForm] = useState({
    id: null,
    title: '',
    start: '',
    end: '',
    description: '',
    color: '',
  });
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({
        id: initialEvent?.id || null,
        title: initialEvent?.title || '',
        start: initialEvent?.start || '',
        end: initialEvent?.end || '',
        description: initialEvent?.description || '',
        color: initialEvent?.color || 'var(--color-secondary)',
      });
      setErrors({});
      // focus first field
      setTimeout(() => firstFieldRef.current && firstFieldRef.current.focus(), 0);
    }
  }, [open, initialEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.title?.trim()) err.title = 'Title is required';
    if (form.start && form.end && new Date(form.end) < new Date(form.start)) {
      err.end = 'End must be after start';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      start: form.start ? new Date(form.start).toISOString() : new Date().toISOString(),
      end: form.end ? new Date(form.end).toISOString() : new Date().toISOString(),
    };
    onSave && onSave(payload);
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Event editor">
      <form onSubmit={onSubmit}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>
          {form.id ? 'Edit Event' : 'New Event'}
        </h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <Input
            ref={firstFieldRef}
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            error={errors.title}
          />
          <Input
            label="Start"
            name="start"
            type="datetime-local"
            value={form.start}
            onChange={handleChange}
          />
          <Input
            label="End"
            name="end"
            type="datetime-local"
            value={form.end}
            onChange={handleChange}
            error={errors.end}
          />
          <Input
            label="Color"
            name="color"
            type="color"
            value={form.color}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            textarea
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          {form.id ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete && onDelete(form.id)}
              aria-label="Delete event"
            >
              Delete
            </Button>
          ) : <span />}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="button" onClick={onClose} aria-label="Cancel">Cancel</Button>
            <Button type="submit" variant="primary" aria-label="Save event">Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
