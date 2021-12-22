import { computed } from "vue";

function useModelWrapper(props, emit, name = 'modelValue') {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  });
};

function useIsPrice(evn) {
  if (/[^.0-9]/.test(evn.key)) return evn.preventDefault();
}

function useIsNumber(evn) {
  if (/[^0-9]/.test(evn.key)) return evn.preventDefault();
}

function useFormatPrice(evn) {
  const value = evn.target.value.replace(/[^\d.]/g, "");
  if (value != "" && !isNaN(value)) {
    return parseFloat(value)
      .toFixed(2)
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
  return null;
}

function useCreateFormData(formData, key, data) {
  if (data === Object(data) || Array.isArray(data)) {
      for (let i in data) {
        useCreateFormData(formData, `${ key }[${ i }]`, data[i]);
      }
  } else {
      formData.append(key, data);
  }
  return formData;
}

function useCreateSlug(text) {
  const 
    from = "áäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;",
    to   = "aaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";

  text = text.replace(/^\s+|\s+$/g, "").toLowerCase();

  for (let i = 0; i < from.length; i++) {
    text = text.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  return text
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export {
  useModelWrapper,
  useIsPrice,
  useIsNumber,
  useFormatPrice,
  useCreateFormData,
  useCreateSlug
};