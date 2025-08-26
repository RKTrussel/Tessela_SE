import { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import api from "../../../../api"; 

export default function useItemAddInfo() {
    const [images, setImages] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [active, setActive] = useState("basic");

    const [form, setForm] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        condition: "New",
        barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString() 
    });

    // Refs for scroll spy
    const basicRef = useRef(null);
    const salesRef = useRef(null);
    const othersRef = useRef(null);
    const barcodeRef = useRef(null);

    const STICKY_OFFSET = 56;

    const scrollTo = (ref, key) => {
        const el = ref?.current;
        if (!el) return;
        const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        (STICKY_OFFSET + 12);
        window.scrollTo({ top: y, behavior: "smooth" });
        setActive(key);
    };

    // Scroll spy
    useEffect(() => {
        const sections = [
        { key: "basic", ref: basicRef },
        { key: "sales", ref: salesRef },
        { key: "others", ref: othersRef },
        ];

        const onScroll = () => {
        const current = window.scrollY + STICKY_OFFSET + 10;
        let activeKey = "basic";
        for (const s of sections) {
            const el = s.ref.current;
            if (!el) continue;
            if (current >= el.offsetTop) activeKey = s.key;
        }
        setActive(activeKey);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (barcodeRef.current && form.barcode) {
            JsBarcode(barcodeRef.current, form.barcode, {
            format: "CODE128",
            displayValue: true,
            width: 2,
            height: 60,
            });
        }
    }, [form.barcode]);

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onImages = (e) =>
        setImages(Array.from(e.target.files || []).slice(0, 9));

    const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("condition", form.condition);
    formData.append("barcode_value", form.barcode);

    images.forEach((img, i) => {
        formData.append("images[]", img); 
    });

    try {
        const res = await api.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Saved product:", res.data);
        setSubmitted(true);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
    };

    const sectionStyle = { scrollMarginTop: STICKY_OFFSET + 15 };

    return {
        state: { images, submitted, active, form },
        set: { setSubmitted },
        refs: { basicRef, salesRef, othersRef, barcodeRef },
        handlers: { onChange, onImages, submit, scrollTo },
        ui: { sectionStyle, STICKY_OFFSET },
    };
}